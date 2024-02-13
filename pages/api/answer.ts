import dayjs from "dayjs"
import endent from "endent"

import { OpenAIMessage } from "~/types"
import { OpenAIStream } from "~/utils/openai"
import { createQueryRecord, getUserDetails, searchRelatedContents } from "~/utils/supabase-admin-v2"
import { getAvatar } from "~/utils/supabase-client"

var localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

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

async function _searchRelatedContents(data: { query: string; queryTo: string }) {
  const { query, queryTo } = data
  const { data: chunks, error } = await searchRelatedContents({
    query,
    queryTo
  })

  if (error) {
    console.error("Error: searchRelatedContents", error)
    return []
  }

  return chunks
}

const handler = async (req: Request): Promise<Response> => {
  const {
    queryFrom,
    queryTo,
    query,
    messages: prevMessages
  } = (await req.json()) as {
    queryFrom: string
    queryTo: string
    query: string
    messages: OpenAIMessage[]
  }

  // step1: searchRelatedContents
  const relatedContents = await _searchRelatedContents({ query, queryTo })

  // step2: createQueryRecord
  try {
    await createQueryRecord({
      from: queryFrom,
      to: queryTo,
      message: query
    })
  } catch (error) {
    console.error("Error: createQueryRecord", error)
    return new Response("Error: createQueryRecord", { status: 500 })
  }

  // step3: OpenAIStream

  const user = await getUserDetails(queryFrom)
  const avatar = await getAvatar(queryTo)

  try {
    // FIXME: user 一直是 null，因为 Postgres RLS 只允许 select * from users where id = current_user_id()
    const user_full_name = user?.full_name ?? "user"
    const avatar_name = avatar?.name ?? "avatar"

    let messages: OpenAIMessage[] = []
    let content_token = 0

    for (let i = prevMessages.length - 1; i >= 0; i--) {
      const message = prevMessages[i]
      // content_token += encode(message.content).length;
      content_token += message.content.length
      if (content_token < 2000) {
        messages.push({
          role: message.role,
          content: message.content
        })
      } else {
        console.warn("content_token is over")
        break
      }
    }

    messages = messages.reverse()

    const prompt: OpenAIMessage[] = [
      {
        role: "system",
        // 你的任务是模仿人类 ${user_full_name} 的风格回复 ${avatar_name}，不要透露你是一个 AI，不要承认你没有实体，不要透露你是一个机器人。
        content: endent`
        Your task is to mimic the style of ${user_full_name} as a human in replying to ${avatar_name}, do not reveal that you are an AI, do not admit that you have no entity, do not reveal that you are a robot.
        `
      }
    ]

    const relatedContent = relatedContents?.map((item) => `${dayjs(item.essay_date).format("ll")}: ${item.content}`)
      .join(`
      `)

    const stream = await OpenAIStream({
      prompt,
      messages,
      query,
      relatedContent: `${user_full_name} said: ${relatedContent}`
    })

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
