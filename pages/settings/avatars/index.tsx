import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { IconEdit, IconMessage, IconPlus } from "@tabler/icons-react";

import { Header } from "~/components/lp/Header";
import { Avatar } from "~/types";

export default function SettingsAvatarsPage({ avatars }: { avatars: Avatar[] }) {
  const user = useUser();
  return (
    <>
      <Header />
      <div className="">
        <div className="mx-auto max-w-7xl px-6  lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your Avatars</h2>
            <p className="text-center text-lg mb-8 leading-8 text-gray-600">
              Talking to them, train them, and they will learn to talk to you.
            </p>
          </div>
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <li>
              <Link
                type="button"
                href="/settings/avatars/new"
                className="h-full relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <IconPlus className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new avatar</span>
              </Link>
            </li>

            {avatars.map((avatar) => (
              <li
                key={avatar.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow flex flex-col justify-between"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-lg font-medium text-gray-900">{avatar.name}</h3>
                      <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {avatar.status}
                      </span>
                    </div>
                    <p className=" text-sm">@{avatar.username}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{avatar.bio ?? ""}</p>
                  </div>

                  {avatar.avatar_url ? (
                    <>
                      <div className="avatar">
                        <img className="!w-16 rounded-full" src={avatar.avatar_url} alt={`Avatar of ${avatar.name}`} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="avatar placeholder">
                        <div className="!w-16 bg-neutral-focus text-neutral-content rounded-full">
                          <span className="text-4xl">{avatar.name[0]}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <Link
                        href={`/chat/${avatar.username}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                      >
                        <IconMessage className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        Chat
                      </Link>
                    </div>
                    {avatar.owner_id === user?.id ? (
                      <div className="-ml-px flex w-0 flex-1">
                        <Link
                          href={`/settings/avatars/${avatar.username}`}
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                          <IconEdit className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          Train
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
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
