import Link from "next/link"

import { useUser } from "@supabase/auth-helpers-react"
import { IconDatabase, IconMessage, IconPlus } from "@tabler/icons-react"

import { Avatar } from "~/types"

export function AvatarsGrid({ avatars, withCreate }: { avatars: Avatar[]; withCreate?: boolean }) {
  const user = useUser()
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {avatars.map((avatar) => (
        <li
          key={avatar.id}
          className=" flex flex-col justify-between divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center  justify-between space-x-3">
                <h3 className="truncate text-lg font-medium text-gray-900">{avatar.name}</h3>
                {avatar.status !== "public" ? (
                  <span className="inline-block flex-shrink-0 rounded-full bg-slate-300 px-2 py-0.5 text-xs font-medium text-slate-800">
                    {avatar.status}
                  </span>
                ) : null}
              </div>
              <p className=" text-sm">@{avatar.username}</p>
              <p className="mt-1 truncate text-sm text-gray-500">{avatar.bio ?? ""}</p>
            </div>

            <Link
              href={
                avatar.owner_id === user?.id ? `/settings/avatars/${avatar.username}` : `/avatars/${avatar.username}`
              }
            >
              {avatar.avatar_url ? (
                <>
                  <div className="avatar">
                    <img
                      className="!h-16 !w-16 rounded-full"
                      src={avatar.avatar_url}
                      alt={`Avatar of ${avatar.name}`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="placeholder avatar">
                    <div className="!h-16 !w-16 rounded-full bg-neutral-focus text-neutral-content">
                      <span className="text-4xl">{avatar.name[0]}</span>
                    </div>
                  </div>
                </>
              )}
            </Link>
          </div>
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
              {avatar.owner_id === user?.id ? (
                <div className="-ml-px flex w-0 flex-1">
                  <Link
                    href={`/settings/avatars/${avatar.username}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <IconDatabase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    MEMO
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </li>
      ))}
      {withCreate ? (
        <li>
          <Link
            type="button"
            href="/settings/avatars/new"
            className=" relative block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <IconPlus className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new avatar</span>
          </Link>
        </li>
      ) : null}
    </ul>
  )
}
