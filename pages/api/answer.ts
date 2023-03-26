import endent from "endent";

import { OpenAIStream } from "~/utils/openai";
import { getAvatar } from "~/utils/supabase-client";
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

    await createQueryRecord({
      from: queryFrom,
      to: queryTo,
      message: query
    });

    const messages = [
      // MEMO: 调教 openAI
      {
        role: "system",
        content: endent`Please disguise yourself as ${avatar?.name}, This is your past message:
        ###
        ${chunks?.map((d: any) => d.content).join("\n\n")}
        ###
        Please answer the question in a similar style.`
      },
      {
        role: "user",
        content: query
      }
    ];

    const stream = await OpenAIStream({ messages });

    const [stream1, stream2] = stream.tee();

    readStream(stream2).then((message) => {
      createQueryRecord({
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
