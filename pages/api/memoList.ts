import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function memoList(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { avatar_id, cursor: from = 0 } = req.body as { avatar_id: string; cursor: number };

  const PAGE_SIZE = 10;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("memos")
    .select("*", { count: "exact" })
    .eq("avatar_id", avatar_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const nextCursor = (count || 0) <= to ? undefined : to + 1;

  return res.status(200).json({
    items: data,
    nextCursor
  });
}
