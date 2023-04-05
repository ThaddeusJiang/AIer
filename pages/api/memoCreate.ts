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
 * @param param0
 *
 * - [ ] insert memo record into DB
 * - [ ] return memo id
 * - [ ] get embedding from OpenAI
 * - [ ] insert embedding into DB
 * - [ ] return embedding id
 * - [ ] update memo record with embedding result : boolean
 */
export default async function memoCreate(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { avatar_id, content } = req.body as { avatar_id: string; content: string };

  const memoInsertInput = {
    content,
    avatar_id,
    created_by: user.id
  };

  const { data, error } = await supabase.from("memos").insert(memoInsertInput).select("*").single();

  if (error) {
    return res.status(500).json({ error: error.message });
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

  const { data: embeddingsData, error: embeddingError } = await supabase
    .from("embeddings")
    .insert(embeddingInsertInput)
    .select("*")
    .single();
  if (!embeddingError) {
    // TODO: embeddings
    await supabase
      .from("memos")
      .update({ embeddings: [embeddingsData.id] })
      .eq("id", data.id);
  }

  return res.status(200).json(data);
}
