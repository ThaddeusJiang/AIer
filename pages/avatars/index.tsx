import { GetServerSidePropsContext } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { AvatarsValuesMessage } from "~/components/lp/AvatarsValuesMessage"
import { Header } from "~/components/lp/Header"
import { AvatarCardWithMarkIcon } from "~/components/ui/Avatar/AvatarCardWithMarkIcon"
import { Avatar } from "~/types"

export default function AvatarsPage({
  avatars
}: {
  avatars: (Avatar & {
    isMarked: boolean
  })[]
}) {
  return (
    <>
      <Header />
      <section id="avatars" aria-label="Avatars" className="">
        <div className="mx-auto max-w-7xl px-6  lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Avatars</h2>
            <AvatarsValuesMessage />
          </div>

          <div className="my-20">
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {avatars.map((avatar) => (
                <li key={avatar.id}>
                  <AvatarCardWithMarkIcon avatar={avatar} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)
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

  const { data, error } = await supabase.from("avatars").select("*, users (id)")

  if (error) {
    console.error(error)
    return {
      props: {
        avatars: []
      }
    }
  }

  const result = data.map((item) => {
    return {
      ...item,
      isMarked: (item.users || []).map((item: { id: string }) => item.id).includes(user.id)
    }
  })

  return {
    props: {
      avatars: result
    }
  }
}
