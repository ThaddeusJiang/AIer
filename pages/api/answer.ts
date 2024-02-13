import endent from "endent"

// import { encode } from "gpt-3-encoder";
import { OpenAIStream } from "~/utils/openai"
import { createQueryRecord, getUserDetails, searchEmbeddings } from "~/utils/supabase-admin-v2"
import { getAvatar } from "~/utils/supabase-client"

export const config = {
  runtime: "edge"
}

async function readStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader()
  let data = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      return data
    }
    data += new TextDecoder().decode(value)
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const {
      queryFrom,
      queryTo,
      query,
      messages: prevMessages
    } = (await req.json()) as {
      queryFrom: string
      queryTo: string
      query: string
      messages: { role: string; content: string }[]
    }

    const { data: chunks, error } = await searchEmbeddings({
      query,
      queryTo
    })

    if (error) {
      console.error(error)
      return new Response("Error", { status: 500 })
    }

    const user = await getUserDetails(queryFrom)
    const avatar = await getAvatar(queryTo)

    await createQueryRecord({
      from: queryFrom,
      to: queryTo,
      message: query
    })

    let messages = []

    // FIXME: user 一直是 null，因为 Postgres RLS 只允许 select * from users where id = current_user_id()
    const user_full_name = user?.full_name ?? "user"
    const avatar_name = avatar?.name ?? "avatar"
    let content_token = 0
    for (let i = prevMessages.length - 1; i >= 0; i--) {
      const message = prevMessages[i]
      // content_token += encode(message.content).length;
      content_token += message.content.length
      if (content_token < 2000) {
        messages.push(message)
      } else {
        console.warn("content_token is over")
        break
      }
    }

    messages = messages.reverse()

    messages.push({
      role: "system",
      content: endent`
        Please pretend to be a human named "${avatar_name}" and communicate with "${user_full_name}".
        Please refer to your past posts and in the same style reply the ${user_full_name}'s message: ${query}
        Your past posts:
        ###
        ${chunks?.map((d: any) => d.content).join("\n\n")}
        ###
        `
    })

    const stream = await OpenAIStream({ messages })

    const [stream1, stream2] = stream.tee()

    // MEMO: 如果没有 Serverless Function 的 timeout 限制，可以这样做
    // readStream(stream2).then(async (message) => {
    //   await createQueryRecord({
    //     from: queryTo,
    //     to: queryFrom,
    //     message
    //   });
    // });

    return new Response(stream1)
  } catch (error) {
    console.error(error)
    return new Response("Error", { status: 500 })
  }
}

export default handler
