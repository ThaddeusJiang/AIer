import { GetServerSidePropsContext } from "next"
import Head from "next/head"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Header } from "~/components/lp/Header"
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"
import { Avatar } from "~/types"

export default function AvatarPage({ avatar }: { avatar: Avatar }) {
  const meta = {
    title: `Talk with ${avatar?.name} in AIer.app`,
    description: `Hello, I am ${avatar?.name}. Feel free to chat with me anytime, anywhere.`
  }
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>

      <Header />
      <MainLayout>
        <AvatarProfileHeader avatar={avatar} />
      </MainLayout>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { username } = context.params as { username: string }

  const { data, error } = await supabase
    .from("avatars")
    .select("*, embeddings(count)")
    .eq("username", username.toLowerCase())
    .maybeSingle()

  const { count: queriesCountQueryData, error: queriesCountQueryError } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true })
    .eq("from_id", username.toLowerCase())

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

  const {
    embeddings: [{ count: essaysCount }],
    ...rest
  } = data

  return {
    props: {
      avatar: {
        ...rest,
        essaysCount,
        repliesCount: queriesCountQueryData || 0
      }
    }
  }
}
