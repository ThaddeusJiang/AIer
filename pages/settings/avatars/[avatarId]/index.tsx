import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { IconEdit, IconMessageCircle2 } from "@tabler/icons-react";

import { Header } from "~/components/lp/Header";
import { DefaultAvatar } from "~/components/ui/Avatar/DefaultAvatar";
import { Avatar } from "~/types";

export default function SettingsAvatarPage({ avatar }: { avatar: Avatar }) {
  return (
    <>
      <Header />
      <div className="flex  justify-center">
        <DefaultAvatar avatar={avatar} />
      </div>
      <div className="flex space-x-4 justify-center">
        <Link href={`/settings/avatars/${avatar.id}/memos`} className="btn  gap-2 btn-outline">
          memos
          <IconEdit className="w-6" />
        </Link>

        <Link href={`/chat/${avatar.id}`} className="btn gap-2 btn-outline">
          chat
          <IconMessageCircle2 className="w-6" />
        </Link>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };
  }

  const { avatarId } = context.params as { avatarId: string };

  const { data: avatar, error } = await supabase.from("avatars").select().eq("id", avatarId).single();
  if (error) {
    console.error(error);
    return {
      props: {
        avatar: null
      }
    };
  }

  return {
    props: {
      avatar
    }
  };
};
