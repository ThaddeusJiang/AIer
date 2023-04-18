import { createClient } from "@supabase/supabase-js"

import type { Database } from "types_db"

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

const apiKey = process.env.OPENAI_API_KEY

export const searchEmbeddings = async ({
  query,
  limit = 5,
  queryTo
}: {
  query: string
  limit?: number
  queryTo: string
}) => {
  const input = query.replace(/\n/g, " ")

  const embeddingsJson = await fetch("https://api.openai.com/v1/embeddings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input
    })
  })

  const json = await embeddingsJson.json()
  const embedding = json.data[0].embedding

  const { data, error } = await supabaseAdmin.rpc("embeddings_search", {
    query_embedding: embedding,
    similarity_threshold: 0.01,
    match_count: limit,
    query_to: queryTo
  })

  return { data, error }
}

export const createQueryRecord = async ({ from, to, message }: { from: string; to: string; message: string }) => {
  const queryData = {
    from_id: from,
    to_id: to,
    content: message
  }
  const { error, data } = await supabaseAdmin.from("queries").insert(queryData).select()
  if (error) throw error
  const [{ id }] = data
  console.log(`Query inserted: ${id}`)
}

// DB:memos, CRUD and search
export const createMemo = async ({
  content,
  avatar_id,
  created_by
}: {
  content: string
  avatar_id: string
  created_by: string
}) => {
  const memoData = {
    content,
    avatar_id,
    created_by
  }
  const { error, data } = await supabaseAdmin.from("memos").insert(memoData).select()
  if (error) throw error
  const [{ id }] = data
  console.log(`Memo inserted: ${id}`)
}

export const readMemo = async ({ id }: { id: string }) => {
  const { data, error } = await supabaseAdmin.from("memos").select().eq("id", id)
  if (error) throw error
  return data
}

export const updateMemo = async ({ id, content }: { id: string; content: string }) => {
  const memoData = {
    content,
    updated_at: new Date().toISOString()
  }
  const { error, data } = await supabaseAdmin.from("memos").update(memoData).eq("id", id).select()
  if (error) throw error
  const [{ id: updatedId }] = data
  console.log(`Memo updated: ${updatedId}`)
  return data[0]
}

export const deleteMemo = async ({ id }: { id: string }) => {
  const { error, data } = await supabaseAdmin
    .from("memos")
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
  if (error) throw error
  const [{ id: deletedId }] = data
  console.log(`Memo deleted: ${deletedId}`)
  return data[0]
}

export const listMemos = async ({ from = 0, to = 100 }: { from: number; to: number }) => {
  const { data, error } = await supabaseAdmin.from("memos").select().range(from, to)
  if (error) throw error
  return data
}

export const searchMemos = async ({ query, limit = 100 }: { query: string; limit?: number }) => {
  const { data, error } = await supabaseAdmin.from("memos").select().textSearch("content", query).limit(limit)
  if (error) throw error
  return data
}

export const getUserDetails = async (id: string) => {
  // TODO: 最优雅的方式是在 Next.js Edge API 中 使用 supabase-js 的 auth.user() 方法获取用户信息
  const { data, error } = await supabaseAdmin.from("users").select().eq("id", id).maybeSingle()

  if (error) {
    console.error(error)
  }

  return data
}
