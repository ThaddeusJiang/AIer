import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "~/components/lp/Header";
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader";
import { AvatarProfileTabs } from "~/components/ui/Avatar/AvatarProfileTabs";
import { Avatar } from "~/types";

export default function SettingsAvatarQueriesPage({
  avatar,
  replies,
  users
}: {
  avatar: Avatar;
  replies: number;
  users: number;
}) {
  const router = useRouter();
  const { username } = router.query as { username: string };

  return (
    <>
      <Header />
      <section className="mx-auto max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
        <AvatarProfileHeader username={username} />
        <AvatarProfileTabs username={username} active="replies" />
        <div className="mx-auto mt-4 max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
          <div className=" min-h-screen">
            <div className="stats w-full shadow">
              {/* TODO: Total replies, Users, followers */}
              <div className="stat place-items-center">
                <div className="stat-title">Replies</div>
                <div className="stat-value">{replies}</div>
                {/* <div className="stat-desc">From January 1st to February 1st</div> */}
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Users</div>
                <div className="stat-value text-secondary">{users}</div>
                {/* <div className="stat-desc text-secondary">↗︎ 40 (2%)</div> */}
              </div>

              {/* <div className="stat place-items-center">
                <div className="stat-title">Followers</div>
                <div className="stat-value">1,200</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div> */}
            </div>
          </div>
        </div>
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

  /**
   * TODO: supabase 可以直接查询出 replies 和 users 的数量吗？
   * ```sql
   * SELECT COUNT(*) AS replies, COUNT(DISTINCT from_id) AS users FROM queries WHERE to_id = 'jiang1';
   * ```
   */
  const { data: queries, error: repliesError } = await supabase
    .from("queries")
    .select("id, from_id")
    .eq("to_id", data[0]?.id);

  const uniqueIds = new Set();
  const uniqueFromIds = new Set();

  queries?.forEach((reply) => {
    uniqueIds.add(reply.id);
    uniqueFromIds.add(reply.from_id);
  });

  if (repliesError) {
    console.error(repliesError);
  }

  return {
    props: {
      avatar: data[0],
      replies: uniqueIds.size ?? 0,
      users: uniqueFromIds.size ?? 0
    }
  };
};
