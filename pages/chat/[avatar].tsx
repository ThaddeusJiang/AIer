import { useEffect, useRef } from "react";

import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";

import { Header } from "~/components/lp/Header";
import { MiniAvatar } from "~/components/ui/Avatar/MiniAvatar";
import { Chat } from "~/components/ui/Chat/Chat";
import { MessageList } from "~/components/ui/MessageList/MessageList";
import { useUser } from "~/utils/useUser";

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
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const listMessagesQuery = useQuery({
    queryKey: ["listMessages", avatar.id],
    queryFn: async () => {
      const res = await fetch("/api/messages.list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar: avatar.id
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
          <div className="w-full px-4 sm:max-w-screen-sm mx-auto">
            <MiniAvatar avatar={avatar} />
          </div>
        </div>
        <div className="overflow-hidden ">
          <div ref={messageContainerRef} className=" w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
            {listMessagesQuery.isLoading ? <div className=" h-8 ">&nbsp;</div> : <MessageList messages={messages} />}
          </div>
        </div>
        <div className="flex-shrink-0 ">
          <div className="w-full sm:max-w-screen-sm mx-auto pb-4">
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

  const { avatar } = ctx.params as { avatar: string };

  const { data, error } = await supabase.from("avatars").select().eq("username", avatar).single();
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
