import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { IconEdit, IconMessage, IconPlus } from "@tabler/icons-react";

import { Header } from "~/components/lp/Header";
import { DefaultAvatar } from "~/components/ui/Avatar/DefaultAvatar";

export default function SettingsAvatarsPage({
  avatars
}: {
  avatars: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    bio?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
  }[];
}) {
  return (
    <>
      <Header />
      <div className="">
        <div className="mx-auto max-w-7xl px-6  lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Avatars</h2>
            <p className="hidden mt-4 text-lg leading-8 text-gray-600">TODO: Add a description here.</p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4"
          >
            <li className="mx-auto">
              <Link
                href="/settings/avatars/new"
                className="btn btn-circle btn-outline border-dashed border-2 w-40 h-40"
              >
                <IconPlus className="w-20 h-20 border-dashed" />
              </Link>
            </li>
            {avatars.map((avatar) => (
              <li className="mx-auto" key={avatar.username}>
                <DefaultAvatar avatar={avatar} url={`/chat/${avatar.username}`} edit={true} />
              </li>
            ))}
          </ul>
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
