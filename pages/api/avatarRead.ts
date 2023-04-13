import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function avatarRead(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { username } = req.body as { username: string };

  const { data, error } = await supabase.from("avatars").select().eq("username", username.toLowerCase()).maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404);
  }

  return res.status(200).json(data);
}
