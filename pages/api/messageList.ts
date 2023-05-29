import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function messageList(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { avatar, cursor: from = 0 } = req.body as { avatar: string; cursor: number }

  const PAGE_SIZE = 25
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from("queries")
    .select("*", { count: "exact" })
    .or(`and(from_id.eq.${user.id},to_id.eq.${avatar}), and(from_id.eq.${avatar},to_id.eq.${user.id})`)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const nextCursor = (count || 0) <= to ? undefined : to + 1

  return res.status(200).json({
    items: data,
    nextCursor
  })
}
