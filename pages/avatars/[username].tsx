import { useRouter } from "next/router"

import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"

export default function AvatarPage() {
  const router = useRouter()
  const { username } = router.query as { username: string }

  return (
    <>
      <MainLayout>
        <AvatarProfileHeader username={username} />
      </MainLayout>
    </>
  )
}
