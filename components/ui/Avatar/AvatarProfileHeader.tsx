import { toast } from "react-hot-toast"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import { IconBookmark, IconLock, IconLockOpen, IconMessage, IconNotes } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Avatar } from "~/types"
import { useUser } from "~/utils/useUser"

export const AvatarProfileHeader = ({ username, isSetting = false }: { username: string; isSetting?: boolean }) => {
  const { user } = useUser()
  const router = useRouter()

  const queryClient = useQueryClient()

  const avatarQuery = useQuery<
    Avatar & {
      marked: { id: string }[]
    }
  >({
    queryKey: ["avatars", username],
    queryFn: async () => {
      return fetch(`/api/avatarRead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username
        })
      }).then((res) => res.json())
    }
  })

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
      router.replace(router.asPath)
    }
  })

  const changeStatus = () => {
    changeStatusMutation.mutate({
      status: avatar?.status !== "public" ? "public" : "private",
      username
    })
  }

  const markAvatarMutation = useMutation({
    mutationFn: async (data: { avatar_username: string }) => {
      const res = await fetch("/api/avatarMark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success("Avatar marked")
      queryClient.refetchQueries(["avatars", username])
    }
  })

  const unMarkAvatarMutation = useMutation({
    mutationFn: async (data: { avatar_username: string }) => {
      const res = await fetch("/api/avatarUnMark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success("Avatar unmarked")
      queryClient.refetchQueries(["avatars", username])
    }
  })

  if (avatarQuery.isLoading) {
    return <AvatarProfileHeaderSkeleton />
  }

  if (avatarQuery.isError) {
    return <div>Error</div>
  }

  const avatar = avatarQuery.data
  const editable = user?.id === avatar?.owner_id

  return (
    <>
      <header className=" relative rounded-lg bg-white pb-4 ">
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
            <Link href={isSetting ? `/settings/avatars/${username}` : `/avatars/${username}`}>
              {avatar?.avatar_url ? (
                <>
                  <div className="avatar">
                    <img
                      className="!h-28 !w-28 rounded-full"
                      src={avatar?.avatar_url}
                      alt={`Avatar of ${avatar?.name}`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="placeholder avatar">
                    <div className="!h-28 !w-28 rounded-full bg-neutral-focus text-neutral-content">
                      <span className="text-4xl">{avatar?.name[0] ?? " "}</span>
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
                  <input type="checkbox" checked={avatar?.status === "public"} onChange={changeStatus} />

                  {/* moon icon */}
                  <IconLockOpen className="swap-on " />
                  {/* sun icon */}
                  <IconLock className="swap-off" />
                </label>
              )}

              {avatar.marked.map(({ id }: { id: string }) => id).includes(user?.id ?? "") ? (
                <button
                  onClick={() => {
                    unMarkAvatarMutation.mutate({ avatar_username: avatar.username })
                  }}
                >
                  <IconBookmark className="h-5 w-5 fill-blue-500 text-blue-500" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    markAvatarMutation.mutate({ avatar_username: avatar.username })
                  }}
                >
                  <IconBookmark className="h-5 w-5 text-gray-400" />
                </button>
              )}

              <Link href={`/chat/${avatar?.username}`}>
                <IconMessage />
              </Link>
            </div>
          </div>
        </div>

        <div className="ml-4 mt-14">
          <div className="flex items-center space-x-3">
            <h3 className=" text-2xl font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name ?? " "} </h3>
            {avatar?.status !== "public" ? (
              <span className="inline-block flex-shrink-0  rounded-lg bg-slate-300 px-2 py-0.5 text-xs font-medium text-slate-800">
                {avatar?.status}
              </span>
            ) : null}
          </div>
          <h4 className=" text-sm ">{avatar?.username ? `@${avatar?.username}` : " "} </h4>
          <p className="mt-2 text-sm leading-6 text-gray-600">{avatar?.bio ?? " "}</p>

          <div className="mt-2 flex gap-2 text-slate-600">
            <div className="flex">
              <IconNotes />
              <span>{avatar?.essaysCount} essays</span>
            </div>
            <div className="flex">
              <IconMessage />
              <span>{avatar?.repliesCount} replies</span>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

function AvatarProfileHeaderSkeleton() {
  return (
    <header className=" relative rounded-lg bg-white pb-4 ">
      <div>
        <Image
          src="https://source.unsplash.com/random/800x600?orientation=landscape&query=robot"
          alt="avatar's profile background image"
          width={800}
          height={600}
          className="max-h-28 w-full object-cover object-center"
        />
      </div>
      <div className="relative animate-pulse">
        <div className=" absolute -bottom-14 left-4">
          <div className="placeholder avatar">
            <div className="!h-28 !w-28 rounded-full bg-slate-200 text-neutral-content"></div>
          </div>
        </div>
      </div>

      <div className="ml-4 mt-14 animate-pulse">
        <div className="flex items-center space-x-3">
          <h3 className=" h-4 w-40 rounded-lg bg-slate-200 text-2xl font-semibold leading-7 tracking-tight text-gray-900"></h3>
        </div>
        <h4 className="mt-2 h-4 w-40 rounded-lg bg-slate-200 text-sm"></h4>
        <p className="mt-4 h-4 w-1/2 rounded-lg bg-slate-200 text-sm leading-6"></p>

        <div className="mt-2 flex gap-2 text-slate-600">
          <div className="flex">
            <span className=" w-20 rounded-lg bg-slate-200">&nbsp;</span>
          </div>
          <div className="flex">
            <span className=" w-20 rounded-lg bg-slate-200">&nbsp;</span>
          </div>
        </div>
      </div>
    </header>
  )
}
