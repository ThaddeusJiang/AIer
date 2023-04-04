import { NextApiRequest, NextApiResponse } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function answerCreate(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { avatar_id, content } = req.body as { avatar_id: string; content: string };

  const answerInsertInput = {
    from_id: avatar_id,
    to_id: user.id,
    content: content
  };

  const { data, error } = await supabase.from("queries").insert(answerInsertInput).select("*").single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
