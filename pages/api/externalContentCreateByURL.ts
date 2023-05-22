import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import axios from "axios"
import * as cheerio from "cheerio"
import { encode } from "gpt-3-encoder"

import { generateEmbeddings } from "~/utils/embedding"

export default async function externalContentCreateByURL(req: NextApiRequest, res: NextApiResponse) {
  // Auth
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    return res.status(401).json({ errorMessage: "The token is invalid." })
  }

  const { url, avatar } = req.body as {
    url: string
    avatar: string
  }
  const avatar_username = avatar.toLowerCase()

  const html = await axios.get(url)
  const $ = cheerio.load(html.data)
  const title = $("title").text()
  const text = $("body").text()

  const content = {
    url: url,
    title: title,
    content: text,
    date: new Date().toISOString(),
    length: text.length,
    tokens: encode(text).length,
    chunks: [],
    avatar_id: avatar_username,
    mentions: []
  }
  const embeddingInsertInputs = await generateEmbeddings(content)

  const { data: embeddingsData, error: embeddingError } = await supabase
    .from("embeddings")
    .insert(embeddingInsertInputs)
    .select("id")

  if (embeddingError) {
    return res.status(500).json({ errorMessage: "Embedding insert error." })
  }

  //   // TODO: embeddings 插入成功，更新 external_content
  // const { data, error } = await supabase.from("external_content").insert([content])

  // if (!embeddingError) {
  //   await supabase
  //     .from("memos")
  //     .update({ embeddings: embeddingsData.map((item) => item.id) })
  //     .eq("id", data.id)
  // }

  return res.status(200).json({ message: "success created!" })
}
