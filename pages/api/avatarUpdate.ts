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

  const { status, avatar_id } = req.body as {
    status: string;
    avatar_id: string;
  };

  const avatarUpdateInput = {
    status,
    id: avatar_id,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("avatars")
    .update(avatarUpdateInput)
    .eq("id", avatar_id)
    .select("*")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
