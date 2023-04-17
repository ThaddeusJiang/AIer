import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function avatarList(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const { token } = req.query as {
    token: string;
  };

  const apiSecret = process.env.API_SECRET;

  if (token !== apiSecret) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const { data, error } = await supabase.from("avatars").select("*, tokens (masked_token)").in("status", ["public", "private"]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ items: data });
}
