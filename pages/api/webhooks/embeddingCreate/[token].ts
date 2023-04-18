import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { encode } from "gpt-3-encoder"

import { generateEmbeddings } from "~/utils/embedding"

/**
 *
 * @param req
 * @param res
 * @returns
 *
 * @example
 * curl -X POST \
 *  http://localhost:3000/api/webhooks/embeddingCreate/[token] \
 *  -H 'Content-Type: application/json' \
 *  -d '{
 *    "content": "Hello World",
 *    "source_url": "https://example.com/post/hello-world",
 *    "date": "2021-08-01T00:00:00.000Z"
 *  }'
 */
export default async function embeddingCreateWebhook(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const { token } = req.query as {
    token: string
  }
  const { data, error } = await supabase.from("tokens").select("*").eq("masked_token", token).single()
  if (error) {
    return res.status(401).json({ errorMessage: "The token is invalid." })
  }
  const { avatar_id, created_by } = data
  const tokenUsageInsertInput = {
    token_id: data.id,
    api: req.url,
    raw: req.body,
    created_by
  }
  await supabase.from("token_usages").insert(tokenUsageInsertInput)

  const { content, url, date } = req.body as { content: string; url?: string; date?: string }

  const embeddingInsertInputs = await generateEmbeddings({
    content,
    url: url || "",
    date: date,
    length: content.length,
    tokens: encode(content).length,
    chunks: [],
    avatar_id,
    title: "",
    mentions: []
  })

  const { data: embeddings, error: embeddingError } = await supabase
    .from("embeddings")
    .insert(embeddingInsertInputs)
    .select("id")

  if (embeddingError) {
    return res.status(500).json({ error: embeddingError.message })
  }

  return res.status(200).json({
    items: embeddings
  })
}
