import { NextApiRequest, NextApiResponse } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import dayjs from "dayjs"

/**
 * 1. create archive record
 * 2. select all memos by avatar_id
 * 3. upload file to storage
 * 4. update archive record
 *
 * @param req
 * @param res
 * @returns
 */

export default async function dataRequest(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { avatar_id } = req.body as { avatar_id: string }

  // db: create record: archives:id
  const archiveCreateInput = {
    avatar_id,
    status: "requested",
    expired_at: dayjs().add(30, "days").toISOString(),
    storage: "",
    created_at: dayjs().toISOString(),
    created_by: user.id
  }

  const { data: recordArchive, error: errArchiveCreate } = await supabase
    .from("archives")
    .insert(archiveCreateInput)
    .select()
    .single()
  if (errArchiveCreate) {
    console.error(errArchiveCreate)
    return res.status(500)
  }

  // TODO: 这里应该拆分 functions，但是如何共享 auth 和 supabase 对象，作为参数传递进去吗？
  // db: select all memos by avatar_id
  const { data: recordMemos, error: errMemos } = await supabase.from("memos").select().eq("avatar_id", avatar_id)
  if (errMemos) {
    console.error(errMemos)
    return res.status(500)
  }

  const jsonData = JSON.stringify(recordMemos, null, 2)

  const { data: recordStorage, error: errStorage } = await supabase.storage
    .from("archives")
    .upload(`${avatar_id}/memos.json`, jsonData, {
      contentType: "application/json",
      upsert: true
    })

  if (errStorage) {
    console.error(errStorage)
    return res.status(500)
  }

  const { data: urlData } = await supabase.storage
    .from("archives")
    .createSignedUrl(`${avatar_id}/memos.json`, 60 * 60 * 24, {
      download: true
    })

  await supabase.from("archives").update({ status: "created", storage: urlData?.signedUrl }).eq("id", recordArchive.id)

  return res.status(200).json({ status: "ok" })
}
