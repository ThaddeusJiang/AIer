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

export const getAvatar = async (id: string): Promise<Avatar | null> => {
  const { data, error } = await supabase.from("avatars").select().eq("id", id).single();

  if (error) {
    console.error(error);
  }

  return (data as any) || null;
};

export const getUserDetails = async (id: string): Promise<UserDetails | null> => {
  const { data, error } = await supabase.from("users").select().eq("id", id).single();

  if (error) {
    console.error(error);
  }

  return (data as any) || null;
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from("users")
    .update({
      full_name: name
    })
    .eq("id", user.id);
};
