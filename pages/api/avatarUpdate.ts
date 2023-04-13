import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function avatarUpdate(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // TODO: 要不要加上 owner_id !== user.id 403 Forbidden

  const { status, username } = req.body as {
    status: string;
    username: string;
  };

  const avatarUpdateInput = {
    status,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("avatars")
    .update(avatarUpdateInput)
    .eq("username", username)
    .select("*")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
