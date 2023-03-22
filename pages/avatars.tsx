import { Avatars } from '@/components/Avatars';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';

export default function AvatarsPage({
  avatars
}: {
  avatars: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    desc?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
  }[];
}) {
  return <Avatars avatars={avatars} />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data, error } = await supabase
    .from('avatars')
    .select()
    .eq('status', 'public');

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
