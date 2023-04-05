import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { encode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";

const createEmbedding = async ({ content }: { content: string }) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: content
  });

  const [{ embedding }] = embeddingResponse.data.data;

  return embedding;
};

/**
 *
 * @param req
 * @param res
 * @returns
 *
 * @example
 * curl -X POST \
 *  http://localhost:3000/api/webhooks/memoCreate/[token] \
 *  -H 'Content-Type: application/json' \
 *  -d '{
 *    "content": "Hello World"
 *  }'
 */
export default async function memoCreateWebhook(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const { token } = req.query as {
    token: string;
  };

  const { data, error } = await supabase.from("tokens").select("*").eq("masked_token", token).single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { avatar_id, created_by } = data;

  const { content } = req.body as { content: string };

  const memoInsertInput = {
    content,
    avatar_id,
    created_by
  };

  const { data: memoCreateData, error: memoCreateError } = await supabase
    .from("memos")
    .insert(memoInsertInput)
    .select("*")
    .single();

  if (memoCreateError) {
    return res.status(500).json({ error: memoCreateError.message });
  }

  /**
   * TODO: 这段可以异步执行；
   * 异步执行方式：
   * 1. 去掉 await 但是 Serverless Function 会有 bug
   * 2. server-side request internal API, rpc/MQ ect.
   */
  const embedding = await createEmbedding({ content });

  const embeddingInsertInput = {
    avatar_id,
    essay_title: content,
    essay_url: "",
    essay_date: "",
    essay_thanks: "",
    content,
    content_length: content.length,
    content_tokens: encode(content).length,
    embedding
  };

  const { error: embeddingError } = await supabase.from("embeddings").insert(embeddingInsertInput);
  if (!embeddingError) {
    await supabase.from("memos").update({ embedded: true }).eq("id", memoCreateData.id);
  }

  return res.status(200).json({ data: memoCreateData });
}
