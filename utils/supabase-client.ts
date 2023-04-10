import { User, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Avatar, ProductWithPrice, UserDetails } from "types";
import type { Database } from "types_db";

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  if (error) {
    console.log(error.message);
  }
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const getPublicAvatars = async (): Promise<Avatar[]> => {
  const { data, error } = await supabase
    .from("avatars")
    .select()
    .eq("status", "public")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (data as any) || [];
};

export const getAvatar = async (id: string) => {
  const { data, error } = await supabase.from("avatars").select().eq("id", id).maybeSingle();

  if (error) {
    console.error(error);
  }

  return data;
};

export const getUserDetails = async (id: string) => {
  // FIXME: postgreSQL RLS 只允许 select * from users where id = current_user_id()
  const { data, error } = await supabase.from("users").select().eq("id", id).maybeSingle();

  if (error) {
    console.error(error);
  }

  return data;
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from("users")
    .update({
      full_name: name
    })
    .eq("id", user.id);
};
