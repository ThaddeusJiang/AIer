import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function memoList(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { avatar_id, cursor: from = 0, q = "" } = req.body as { avatar_id: string; cursor: number; q?: string }

  const PAGE_SIZE = 10
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("memos")
    .select("*", { count: "exact" })
    .eq("avatar_id", avatar_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to)

  const to_tsquery = q
    .split(" ")
    .filter(Boolean)
    .map((item) => `'${item}'`)
    .join(" & ")

  if (to_tsquery) {
    query = query.textSearch("content", `${to_tsquery}`)
  }

  const { data, error, count: _count } = await query

  const count = _count || 0

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const nextCursor = count <= to ? undefined : to + 1

  // memo: better to use header content-range, but it's harder than JSON response
  return res.status(200).json({
    items: data,
    nextCursor,
    count
  })
}
