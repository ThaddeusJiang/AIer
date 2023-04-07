import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "~/components/lp/Header";
import { AvatarsGrid } from "~/components/ui/AvatarsGrid";
import { Avatar } from "~/types";

export default function HomePage({ yours, others }: { yours: Avatar[]; others: Avatar[] }) {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900">Yours</h2>
        <p className="mb-8 text-center text-lg">Talking to them, train them, and they will learn to talk to you.</p>
        <AvatarsGrid avatars={yours} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        {/* <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 mb-8">Favorites</h2> */}
        {/* TODO: */}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        {/* <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 mb-8">Recommends</h2> */}
        {/* TODO: */}
      </section>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context);

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

  const { data: avatars, error } = await supabase.from("avatars").select().eq("status", "public");

  if (error) {
    console.error(error);
    return {
      props: {
        yours: []
      }
    };
  }

  const yours = avatars.filter((avatar) => avatar.owner_id === user.id);
  const others = avatars.filter((avatar) => avatar.owner_id !== user.id);

  return {
    props: {
      yours,
      others
    }
  };
};
