import endent from "endent";

import { OpenAIStream } from "~/utils/openai";
import { getAvatar, getUserDetails } from "~/utils/supabase-client";
import { createQueryRecord, searchEmbeddings } from "~/utils/supabase-only";

export const config = {
  runtime: "edge"
};

async function readStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  let data = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return data;
    }
    data += new TextDecoder().decode(value);
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { queryFrom, queryTo, query } = (await req.json()) as {
      queryFrom: string;
      queryTo: string;
      query: string;
    };

    const { data: chunks, error } = await searchEmbeddings({
      query,
      queryTo
    });

    if (error) {
      console.error(error);
      return new Response("Error", { status: 500 });
    }

    const avatar = await getAvatar(queryTo);
    const user = await getUserDetails(queryFrom);

    await createQueryRecord({
      from: queryFrom,
      to: queryTo,
      message: query
    });

    const messages = [
      // MEMO: 调教 openAI
      {
        role: "system",
        content: endent`
        Please pretend to be a human named ${
          avatar?.name
        }, base on your past posts to imitate a similar style in communicating with ${user?.full_name ?? "guest"}.
        Your past posts:
        ###
        ${chunks?.map((d: any) => d.content).join("\n\n")}
        ###
        `
      },
      {
        role: "user",
        content: query
      }
    ];

    const stream = await OpenAIStream({ messages });

    const [stream1, stream2] = stream.tee();

    await readStream(stream2).then(async (message) => {
      await createQueryRecord({
        from: queryTo,
        to: queryFrom,
        message
      });
    });

    return new Response(stream1);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
