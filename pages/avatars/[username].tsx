import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "~/components/lp/Header";
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader";
import { Avatar } from "~/types";

export default function AvatarPage({ avatar }: { avatar: Avatar }) {
  const meta = {
    title: `Talk with ${avatar?.name} in AIer.app`,
    description: `Hello, I am ${avatar?.name}. Feel free to chat with me anytime, anywhere.`
  };
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>

      <Header />
      <section className="mx-auto max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
        <AvatarProfileHeader avatar={avatar} />
      </section>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { username } = context.params as { username: string };

  const { data, error } = await supabase.from("avatars").select().eq("username", username.toLowerCase()).maybeSingle();

  if (error) {
    console.error(error);
    return {
      props: {
        avatar: null
      }
    };
  }

  if (!data || (data.status !== "public" && data.owner_id !== user?.id)) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      avatar: data
    }
  };
};
