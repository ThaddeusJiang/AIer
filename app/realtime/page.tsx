import "server-only";

import { supabaseAdmin } from "../../utils/supabase-admin";
import { Messages } from "./messages";

// do not cache this page
export const revalidate = 0;

export default async function Realtime() {
  const { data } = await supabaseAdmin.from("queries").select("*");

  return <Messages serverPosts={data || []} />;
}
