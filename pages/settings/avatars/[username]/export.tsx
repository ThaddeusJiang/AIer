// import dayjs relativeTime plugin
import relativeTime from "dayjs/plugin/relativeTime"

import toast from "react-hot-toast"

import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useMutation } from "@tanstack/react-query"

import dayjs from "dayjs"

import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"

dayjs.extend(relativeTime)

export default function AvatarExportPage({ archives }: { archives: any[] }) {
  const router = useRouter()
  const { username } = router.query as { username: string }

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
      router.replace(router.asPath)
    }
  })

  const handleRequest = () => {
    dataRequestMutation.mutate()
  }

  return (
    <>
      <MainLayout>
        <AvatarProfileHeader username={username} isSetting={true} />
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
      </MainLayout>
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
  const avatar_username = username.toLowerCase()

  const { data, error } = await supabase
    .from("archives")
    .select("*")
    .eq("avatar_id", avatar_username)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return {
      props: {
        archives: []
      }
    }
  }

  return {
    props: {
      archives: data
    }
  }
}
