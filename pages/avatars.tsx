import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Avatars } from "~/components/Avatars";
import { Header } from "~/components/lp/Header";
import { Avatar } from "~/types";

export default function AvatarsPage({ avatars }: { avatars: Avatar[] }) {
  return (
    <>
      <Header />
      <Avatars avatars={avatars} />
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data, error } = await supabase
    .from("avatars")
    .select()
    .eq("status", "public")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return {
      props: {
        avatars: []
      }
    };
  }

  return {
    props: {
      avatars: data
    }
  };
};
