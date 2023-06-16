import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Header } from "~/components/lp/Header"
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"

export default function SettingsAvatarDetailPage() {
  const router = useRouter()
  const { username } = router.query as { username: string }

  return (
    <>
      <Header />
      <MainLayout>
        <AvatarProfileHeader username={username} isSetting={true} />

        <div className="grid grid-cols-2 gap-4 py-4">
          <Link href={`/settings/avatars/${username}/memos`} className=" link-hover card link shadow ">
            <div className="card-body">Memos</div>
          </Link>
          <Link href={`/settings/avatars/${username}/training`} className=" link-hover card link shadow ">
            <div className="card-body">Training</div>
          </Link>
          <Link href={`/settings/avatars/${username}/export`} className=" link-hover card link shadow ">
            <div className="card-body">Export</div>
          </Link>
          <Link href={`/settings/avatars/${username}/api`} className=" link-hover card link shadow ">
            <div className="card-body">API</div>
          </Link>
          <Link href={`/settings/avatars/${username}/replies`} className=" link-hover card link shadow ">
            <div className="card-body">Replies</div>
          </Link>
        </div>
      </MainLayout>
    </>
  )
}
