import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function avatarMark(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { avatar_username } = req.body as { avatar_username: string }

  const { data, error } = await supabase
    .from("users_mark_avatars")
    .insert({ user_id: user.id, avatar_id: avatar_username })
    .select("*")
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
}
