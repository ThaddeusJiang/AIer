import Link from "next/link"

import { Avatar } from "~/types"

export function AvatarInfoCard({ avatar }: { avatar: Avatar }) {
  return (
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

      <Link href={`/avatars/${avatar.username}`}>
        {avatar.avatar_url ? (
          <>
            <div className="avatar">
              <img className="!h-16 !w-16 rounded-full" src={avatar.avatar_url} alt={`Avatar of ${avatar.name}`} />
            </div>
          </>
        ) : (
          <>
            <div className="placeholder avatar">
              <div className="!h-16 !w-16 rounded-full bg-neutral-focus text-neutral-content">
                <span className="text-4xl">{avatar?.name?.[0]}</span>
              </div>
            </div>
          </>
        )}
      </Link>
    </div>
  )
}
