import { toast } from "react-hot-toast"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import { IconLock, IconLockOpen, IconMessage, IconNotes } from "@tabler/icons-react"
import { useMutation } from "@tanstack/react-query"

import { Avatar } from "~/types"
import { useUser } from "~/utils/useUser"

export const AvatarProfileHeader = ({ avatar, isSetting = false }: { avatar: Avatar; isSetting?: boolean }) => {
  const { user } = useUser()
  const router = useRouter()
  const editable = user?.id === avatar?.owner_id

  const changeStatusMutation = useMutation({
    mutationFn: async (data: { status: string; username: string }) => {
      const res = await fetch("/api/avatarUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success("Status changed")
      router.push({
        href: router.pathname,
        query: router.query
      })
    }
  })

  const changeStatus = () => {
    changeStatusMutation.mutate({
      status: avatar?.status !== "public" ? "public" : "private",
      username: avatar.username
    })
  }

  return (
    <>
      <header className="relative">
        <div>
          <Image
            src="https://source.unsplash.com/random/800x600?orientation=landscape&query=robot"
            alt="avatar's profile background image"
            width={800}
            height={600}
            className="max-h-28 w-full object-cover object-center"
          />
        </div>
        <div className="relative">
          <div className=" absolute -bottom-14 left-4">
            <Link href={isSetting ? `/settings/avatars/${avatar.username}` : `/avatars/${avatar.username}`}>
              {avatar.avatar_url ? (
                <>
                  <div className="avatar">
                    <img
                      className="!h-28 !w-28 rounded-full"
                      src={avatar.avatar_url}
                      alt={`Avatar of ${avatar.name}`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="placeholder avatar">
                    <div className="!h-28 !w-28 rounded-full bg-neutral-focus text-neutral-content">
                      <span className="text-4xl">{avatar.name[0]}</span>
                    </div>
                  </div>
                </>
              )}
            </Link>
          </div>

          <div className=" absolute top-4 right-4">
            <div className="flex w-1/2 items-center space-x-2">
              {editable && (
                <label className="swap swap-rotate">
                  {/* this hidden checkbox controls the state */}
                  <input type="checkbox" checked={avatar.status === "public"} onChange={changeStatus} />

                  {/* moon icon */}
                  <IconLockOpen className="swap-on " />
                  {/* sun icon */}
                  <IconLock className="swap-off" />
                </label>
              )}

              <Link href={`/chat/${avatar.username}`}>
                <IconMessage />
              </Link>
            </div>
          </div>
        </div>

        <div className="ml-4 mt-14">
          <div className="flex items-center space-x-3">
            <h3 className=" text-2xl font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name}</h3>
            {avatar?.status !== "public" ? (
              <span className="inline-block flex-shrink-0 rounded-full bg-slate-300 px-2 py-0.5 text-xs font-medium text-slate-800">
                {avatar?.status}
              </span>
            ) : null}
          </div>
          <h4 className=" text-sm ">@{avatar.username}</h4>
          <p className="mt-2 text-sm leading-6 text-gray-600">{avatar.bio}</p>

          <div className="mt-2 flex gap-2 text-slate-600">
            <div className="flex">
              <IconNotes className="text-current" />
              <span>{avatar?.essaysCount} essays</span>
            </div>
            <div className="flex">
              <IconMessage />
              <span className="ml-2">{avatar?.repliesCount} replies</span>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
