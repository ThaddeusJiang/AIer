import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

export default function AIersPage({
  avatars
}: {
  avatars: {
    id: string;
    username: string;
  }[];
}) {
  return (
    <>
      {avatars.map((avatar) => (
        <div key={avatar.id}>
          <Link href={`/chat/${avatar.username}`}>{avatar.username}</Link>
        </div>
      ))}
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const { data, error } = await supabase.from('avatars').select();

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
