import Link from "next/link"

import { IconDatabase, IconMessage } from "@tabler/icons-react"

import { Avatar } from "~/types"

import { AvatarInfoCard } from "./AvatarInfoCard"

export function AvatarCardWithSettings({ avatar }: { avatar: Avatar }) {
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
            <Link
              href={`/settings/avatars/${avatar.username}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <IconDatabase className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
