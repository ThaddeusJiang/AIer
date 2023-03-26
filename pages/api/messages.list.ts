import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function listMessages(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { avatar } = req.body as { avatar: string };

  const { data, error } = await supabase
    .from("queries")
    .select("*")
    .or(`and(from_id.eq.${user.id},to_id.eq.${avatar}), and(from_id.eq.${avatar},to_id.eq.${user.id})`)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    items: data
  });
}
