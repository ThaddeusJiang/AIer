import endent from "endent";

import { OpenAIStream } from "~/utils/openai";
import { createQueryRecord, searchEmbeddings } from "~/utils/supabase-only";

export const config = {
  runtime: "edge",
  unstable_allowDynamic: [
    "/node_modules/function-bind/**" // use a glob to allow anything in the function-bind 3rd party module
  ]
};

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

    await createQueryRecord({
      from: queryFrom,
      to: queryTo,
      message: query
    });

    const messages = [
      // MEMO: 调教 openAI
      {
        role: "system",
        content: `Please disguise yourself as ${queryTo}, This is your past message: ${chunks
          ?.map((d: any) => d.content)
          .join("\n\n")}.
        Please answer the question in a similar style.`
      },
      {
        role: "user",
        content: query
      }
    ];

    const stream = await OpenAIStream({ messages });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
