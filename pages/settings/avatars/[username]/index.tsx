import { GetServerSidePropsContext } from "next"
import Link from "next/link"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Header } from "~/components/lp/Header"
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"
import { Avatar } from "~/types"

export default function SettingsAvatarDetailPage({ avatar }: { avatar: Avatar }) {
  return (
    <>
      <Header />
      <MainLayout>
        <AvatarProfileHeader avatar={avatar} isSetting={true} />

        <div className="grid grid-cols-2 gap-4 py-4">
          <Link href={`/settings/avatars/${avatar.username}/memos`} className=" link-hover card link shadow ">
            <div className="card-body">Memos</div>
          </Link>
          <Link href={`/settings/avatars/${avatar.username}/training`} className=" link-hover card link shadow ">
            <div className="card-body">Training</div>
          </Link>
          <Link href={`/settings/avatars/${avatar.username}/export`} className=" link-hover card link shadow ">
            <div className="card-body">Export</div>
          </Link>
          <Link href={`/settings/avatars/${avatar.username}/api`} className=" link-hover card link shadow ">
            <div className="card-body">API</div>
          </Link>
          <Link href={`/settings/avatars/${avatar.username}/replies`} className=" link-hover card link shadow ">
            <div className="card-body">Replies</div>
          </Link>
        </div>
      </MainLayout>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const { username } = context.params as { username: string }

  const { data: avatar, error: avatarError } = await supabase
    .from("avatars")
    .select()
    .eq("username", username.toLowerCase())
    .single()

  if (avatarError) {
    console.error(avatarError)
    return {
      props: {
        avatar: null
      }
    }
  }

  if (!avatar) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      avatar
    }
  }
}
