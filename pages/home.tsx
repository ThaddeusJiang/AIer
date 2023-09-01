import { GetServerSidePropsContext } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Header } from "~/components/lp/Header"
import { MarkedAvatarsGrid } from "~/components/ui/MarkedAvatarsGrid"
import { OwnAvatarsGrid } from "~/components/ui/OwnAvatarsGrid"
import { Avatar } from "~/types"

export default function HomePage({
  yours,
  marked
}: {
  yours: Avatar[]
  marked: (Avatar & {
    isMarked: boolean
  })[]
}) {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900">Yours</h2>
        <p className="mb-8 text-center text-lg">Talking to them, train them, and they will learn to talk to you.</p>
        <OwnAvatarsGrid withCreate avatars={yours} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-gray-900">Marked</h2>
        <MarkedAvatarsGrid avatars={marked} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        {/* <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 mb-8">Recommends</h2> */}
        {/* TODO: */}
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

  const { data: yours, error } = await supabase.from("avatars").select().eq("owner_id", user.id)

  if (error) {
    console.error(error)
    return {
      props: {
        yours: [],
        marked: []
      }
    }
  }

  const { data } = await supabase.from("avatars").select("*, users (id)")

  if (!data) {
    return {
      props: {
        yours: [],
        marked: []
      }
    }
  }

  const marked = data
    ?.map((item) => {
      return {
        ...item,
        isMarked: (item.users || []).map((item: { id: string }) => item.id).includes(user.id)
      }
    })
    .filter((item: { isMarked: boolean }) => item.isMarked)

  return {
    props: {
      yours,
      marked
    }
  }
}
