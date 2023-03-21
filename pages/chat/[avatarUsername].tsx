import { Chat } from '@/components/ui/Chat/Chat';
import { useUser } from '@/utils/useUser';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';

export default function ChatPage({
  avatar
}: {
  avatar: {
    id: string;
    username: string;
    name: string;
  };
}) {
  const { user } = useUser();

  return <Chat avatar={avatar} user={user} />;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };
  }

  const { avatarUsername } = ctx.params as { avatarUsername: string };

  const { data, error } = await supabase
    .from('avatars')
    .select()
    .eq('username', avatarUsername)
    .single();
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
      avatar: data
    }
  };
};
