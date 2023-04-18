import { GetServerSidePropsContext } from "next"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { AvatarsValuesMessage } from "~/components/lp/AvatarsValuesMessage"
import { Header } from "~/components/lp/Header"
import { AvatarsGrid } from "~/components/ui/AvatarsGrid"
import { Avatar } from "~/types"

export default function AvatarsPage({ avatars }: { avatars: Avatar[] }) {
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
            <AvatarsGrid avatars={avatars} />
          </div>
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)

  const { data, error } = await supabase
    .from("avatars")
    .select()
    .eq("status", "public")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return {
      props: {
        avatars: []
      }
    }
  }

  return {
    props: {
      avatars: data
    }
  }
}
