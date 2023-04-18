import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { encode } from "gpt-3-encoder"

import { generateEmbeddings } from "~/utils/embedding"
import { createEmbedding } from "~/utils/openai"

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
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { avatar_id, content } = req.body as { avatar_id: string; content: string }

  const memoInsertInput = {
    content,
    avatar_id,
    created_by: user.id
  }

  const { data, error } = await supabase.from("memos").insert(memoInsertInput).select("*").single()

  if (error) {
    return res.status(500).json({ error: error.message })
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
  })

  const { data: embeddingsData, error: embeddingError } = await supabase
    .from("embeddings")
    .insert(embeddingInsertInputs)
    .select("id")

  if (!embeddingError) {
    // TODO: embeddings
    await supabase
      .from("memos")
      .update({ embeddings: embeddingsData.map((item) => item.id) })
      .eq("id", data.id)
  }

  return res.status(200).json(data)
}
