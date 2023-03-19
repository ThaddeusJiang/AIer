import { useUser } from '@/utils/useUser';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { Chat } from '@/components/ui/Chat/Chat';

export default function ChatPage({
  avatar
}: {
  avatar: {
    id: string;
    username: string;
  };
}) {
  const { user } = useUser();

  return (
    <>
      <Chat avatar={avatar} user={user} />
    </>
  );
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

  const { data, error } = await supabase
    .from('avatars')
    .select()
    .eq('username', 'aier')
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
