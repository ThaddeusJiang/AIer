import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function avatarRead(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({
    req,
    res
  })

  const { username } = req.body as { username: string }
  const avatar_username = username?.toLocaleLowerCase()

  const { data, error } = await supabase
    .from("avatars")
    .select("*, embeddings(count), marked:users(id)")
    .eq("username", avatar_username)
    .single()

  const { count: repliesCount } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("from_id", avatar_username)

  const { embeddings, ...rest } = data ?? {}

  const essaysCount = data?.embeddings?.[0]?.count

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({
    ...rest,
    essaysCount: essaysCount ?? 0,
    repliesCount: repliesCount ?? 0
  })
}
