import { useEffect, useRef } from "react"

import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import Link from "next/link"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { IconDots, IconEdit } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

import { Header } from "~/components/lp/Header"
import { MiniAvatar } from "~/components/ui/Avatar/MiniAvatar"
import { Chat } from "~/components/ui/Chat"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"
import { MessageList } from "~/components/ui/MessageList"
import { Avatar } from "~/types"
import { useUser } from "~/utils/useUser"

export default function ChatPage({ avatar }: { avatar: Avatar }) {
  const { user } = useUser()
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const messageListQuery = useQuery({
    queryKey: ["messageList", avatar?.id],
    queryFn: async () => {
      const res = await fetch("/api/messageList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar: avatar?.id
        })
      })
      return res.json()
    }
  })

  const messages = messageListQuery.data?.items ?? []

  useEffect(() => {
    const containerNode = messageContainerRef.current
    containerNode!.scrollTop = containerNode?.scrollHeight ?? 0
  }, [messages])

  const meta = {
    title: `Talk with ${avatar?.name} in AIer.app`,
    description: `Hello, I am ${avatar?.name}. Feel free to chat with me anytime, anywhere.`
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col overflow-hidden ">
        <div className="flex-shrink-0 ">
          <Header />
          <div className="mx-auto flex w-full items-center justify-between space-x-2 px-2 py-2 sm:max-w-screen-sm">
            <div className="flex items-center space-x-2">
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
                <div className="dropdown-end dropdown">
                  <label tabIndex={0} className="btn-ghost btn-xs btn-square btn">
                    <IconDots className="w-4 " />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu rounded-box bg-base-100 p-2 shadow ">
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
          <div ref={messageContainerRef} className="mx-auto max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
            {messageListQuery.isLoading ? <div className=" h-8 ">&nbsp;</div> : <MessageList messages={messages} />}
          </div>
        </div>
        <div className="flex-shrink-0 ">
          <div className="mx-auto w-full py-2 px-2 sm:max-w-screen-sm">
            <Chat avatar={avatar} user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { user }
  } = await supabase.auth.getUser() // TODO: getUser vs. getSession 有什么区别？

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const { username } = ctx.params as { username: string }

  const { data, error } = await supabase.from("avatars").select().eq("username", username.toLowerCase()).maybeSingle()

  if (error) {
    console.error(error)
    return {
      props: {
        avatar: null
      }
    }
  }

  if (!data || (data.status !== "public" && data.owner_id !== user?.id)) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      avatar: data
    }
  }
}
