import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { encode } from "gpt-3-encoder";

import { generateEmbeddings } from "~/utils/embedding";
import { createEmbedding } from "~/utils/openai";

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

  const tokenUsageInsertInput = {
    token_id: data.id,
    api: "/api/webhooks/memoCreate/[token]",
    raw: req.body,
    created_by: data.created_by
  };

  await supabase.from("token_usages").insert(tokenUsageInsertInput);

  const { content, created_at, source_url } = req.body as { content: string; created_at?: string; source_url?: string };

  const memoInsertInput = {
    content,
    created_at: created_at || new Date().toISOString(),
    source_url: source_url,
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

  const embeddingInsertInputs = await generateEmbeddings({
    content,
    date: new Date().toISOString(),
    length: content.length,
    tokens: encode(content).length,
    chunks: [],
    avatar_id,
    url: "",
    title: "",
    mentions: []
  });

  const { data: embeddingsData, error: embeddingError } = await supabase
    .from("embeddings")
    .insert(embeddingInsertInputs)
    .select("id");

  if (!embeddingError) {
    // TODO: embeddings
    await supabase
      .from("memos")
      .update({ embeddings: embeddingsData.map((item) => item.id) })
      .eq("id", memoCreateData.id);
  }

  return res.status(200).json({ data: memoCreateData });
}
