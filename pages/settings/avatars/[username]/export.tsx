// import dayjs relativeTime plugin
import relativeTime from "dayjs/plugin/relativeTime"

import toast from "react-hot-toast"

import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import router from "next/router"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useMutation } from "@tanstack/react-query"

import dayjs from "dayjs"

import { Header } from "~/components/lp/Header"
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { Avatar } from "~/types"

dayjs.extend(relativeTime)

export default function AvatarExportPage({
  username,
  archives,
  avatar
}: {
  username: string
  archives: any[]
  avatar: Avatar
}) {
  const dataRequestMutation = useMutation({
    mutationFn: async () => {
      return fetch("/api/dataRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar_id: username
        })
      })
    },
    onSuccess: () => {
      toast.success("Request sent")
      router.push({
        href: router.pathname,
        query: router.query
      })
    }
  })

  const handleRequest = () => {
    dataRequestMutation.mutate()
  }

  return (
    <>
      <Header />
      <section className="mx-auto max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
        <AvatarProfileHeader avatar={avatar} isSetting={true} />
        <div>
          <div className="flex items-center justify-between py-2">
            <button className=" btn-primary btn" onClick={handleRequest}>
              request avatar data
            </button>
          </div>

          {archives.length > 0 ? (
            <table className="table w-full  border-2">
              <thead>
                <tr>
                  <th>request</th>
                  <th>expires</th>
                </tr>
              </thead>

              <tbody>
                {archives.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link href={item.storage} className="link">
                        {dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
                      </Link>
                    </td>
                    <td>{dayjs(item.expired_at).fromNow()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const { username } = context.params as { username: string }
  const avatar_id = username.toLowerCase()
  const { data, error } = await supabase
    .from("archives")
    .select("*")
    .eq("avatar_id", avatar_id)
    .order("created_at", { ascending: false })

  const { data: avatar, error: avatarError } = await supabase
    .from("avatars")
    .select()
    .eq("username", avatar_id)
    .single()

  if (error) {
    console.error(error)
    return {
      props: {
        username,
        avatar,
        archives: []
      }
    }
  }

  return {
    props: {
      username,
      avatar,
      archives: data
    }
  }
}
