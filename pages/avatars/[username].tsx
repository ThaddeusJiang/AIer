import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "~/components/lp/Header";
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader";
import { Avatar } from "~/types";

export default function AvatarPage({ avatar }: { avatar: Avatar }) {
  return (
    <>
      <Header />
      <section className="px-2 w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
        <AvatarProfileHeader avatar={avatar} />
      </section>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context);

  const { username } = context.params as { username: string };

  const { data, error: avatarError } = await supabase.from("avatars").select().eq("username", username.toLowerCase());

  if (avatarError) {
    console.error(avatarError);
    return {
      props: {
        avatar: null
      }
    };
  }

  if (data.length === 0) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      avatar: data[0]
    }
  };
};