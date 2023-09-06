import Link from "next/link"
import { useRouter } from "next/router"

import { IconBookmark, IconMessage } from "@tabler/icons-react"
import { useMutation } from "@tanstack/react-query"

import { Avatar } from "~/types"

import { AvatarInfoCard } from "./AvatarInfoCard"

export function AvatarCardWithMarkIcon({ avatar }: { avatar: Avatar & { isMarked: boolean } }) {
  const router = useRouter()

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
      router.replace(router.asPath)
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
      router.replace(router.asPath)
    }
  })

  return (
    <div
      key={avatar.id}
      className="flex h-full flex-col justify-between divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <AvatarInfoCard avatar={avatar} />
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <Link
              href={`/chat/${avatar.username}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <IconMessage className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Chat
            </Link>
          </div>

          <div className="-ml-px flex w-0 flex-1">
            {avatar.isMarked ? (
              <button
                onClick={() => {
                  unMarkAvatarMutation.mutate({ avatar_username: avatar.username })
                }}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <IconBookmark className="h-5 w-5 fill-blue-500 text-blue-500" aria-hidden="true" />
                marked
              </button>
            ) : (
              <button
                onClick={() => {
                  markAvatarMutation.mutate({ avatar_username: avatar.username })
                }}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
              >
                <IconBookmark className="h-5 w-5 text-gray-400" aria-hidden="true" />
                mark
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
