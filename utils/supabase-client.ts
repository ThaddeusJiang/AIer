import { User, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Avatar, ProductWithPrice, UserDetails } from "types"
import type { Database } from "types_db"

export const supabase = createBrowserSupabaseClient<Database>()

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" })

  if (error) {
    console.error(error.message)
  }
  // TODO: improve the typing here.
  return (data as any) || []
}

export const getPublicAvatars = async (): Promise<Avatar[]> => {
  const { data, error } = await supabase.rpc("list_avatars_with_embeddings_count")

  if (error) {
    console.error(error)
  }

  return data || []
}

export const getAvatar = async (id: string) => {
  const { data, error } = await supabase.from("avatars").select().eq("id", id).maybeSingle()

  if (error) {
    console.error(error)
  }

  return data
}

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from("users")
    .update({
      full_name: name
    })
    .eq("id", user.id)
}
