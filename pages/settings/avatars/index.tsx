import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "~/components/lp/Header";
import { AvatarsGrid } from "~/components/ui/AvatarsGrid";
import { Avatar } from "~/types";

export default function SettingsAvatarsPage({ avatars }: { avatars: Avatar[] }) {
  return (
    <>
      <Header />
      <div className="">
        <div className="mx-auto max-w-7xl px-6  lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Avatars</h2>
            <p className="text-center text-lg mb-8 leading-8 text-gray-600">
              Talking to them, train them, and they will learn to talk to you.
            </p>
          </div>
          <AvatarsGrid avatars={avatars} withCreate />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };
  }

  const { data, error } = await supabase
    .from("avatars")
    .select()
    .eq("owner_id", user.id)
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
