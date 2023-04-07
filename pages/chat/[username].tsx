import { useEffect, useRef } from "react";

import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { IconDots, IconEdit } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { Header } from "~/components/lp/Header";
import { MiniAvatar } from "~/components/ui/Avatar/MiniAvatar";
import { Chat } from "~/components/ui/Chat/Chat";
import { MessageList } from "~/components/ui/MessageList/MessageList";
import { Avatar } from "~/types";
import { useUser } from "~/utils/useUser";

export default function ChatPage({ avatar }: { avatar: Avatar }) {
  const { user } = useUser();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const listMessagesQuery = useQuery({
    queryKey: ["listMessages", avatar?.id],
    queryFn: async () => {
      const res = await fetch("/api/messages.list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar: avatar?.id
        })
      });
      return res.json();
    }
  });

  const messages = listMessagesQuery.data?.items ?? [];

  useEffect(() => {
    const containerNode = messageContainerRef.current;
    containerNode!.scrollTop = containerNode?.scrollHeight ?? 0;
  }, [messages]);

  return (
    <>
      <Head>
        {/* <title>Talk with {avatar?.name}</title> */}
        <meta name="description" content={`Talk with ${avatar?.name} on the web. Ask me anything!`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen overflow-hidden ">
        <div className="flex-shrink-0 ">
          <Header />
          <div className="w-full sm:max-w-screen-sm mx-auto px-2 py-2 flex justify-between items-center space-x-2">
            <div className="flex space-x-2 items-center">
              <Link href={`/avatars/${avatar.username}`}>
                <MiniAvatar avatar={avatar} />
              </Link>
              <div>
                <p className="text-xl font-semibold tracking-tight text-gray-900">{avatar?.name}</p>
                <p className=" text-sm ">@{avatar.username}</p>
              </div>
            </div>

            <div>
              {user?.id === avatar.owner_id ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-xs btn-square btn-ghost">
                    <IconDots className="w-4 " />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box ">
                    <li>
                      <a className="">
                        <Link href={`/settings/avatars/${avatar.username}`} className="flex gap-2 ">
                          <IconEdit /> Memo
                        </Link>
                      </a>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="overflow-hidden ">
          <div ref={messageContainerRef} className="px-2 w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
            {listMessagesQuery.isLoading ? <div className=" h-8 ">&nbsp;</div> : <MessageList messages={messages} />}
          </div>
        </div>
        <div className="flex-shrink-0 ">
          <div className="w-full sm:max-w-screen-sm mx-auto py-2 px-2">
            <Chat avatar={avatar} user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { user }
  } = await supabase.auth.getUser(); // TODO: getUser vs. getSession 有什么区别？

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };
  }

  const { username } = ctx.params as { username: string };
  // MEMO: .single() 会抛出异常
  const { data, error } = await supabase.from("avatars").select().eq("username", username.toLowerCase());

  if (error) {
    console.error(error);
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
