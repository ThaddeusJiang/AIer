import Link from "next/link"

import { useUser } from "@supabase/auth-helpers-react"
import { IconPlus } from "@tabler/icons-react"

import { Avatar } from "~/types"

import { AvatarCardWithSettings } from "./Avatar/AvatarCardWithSettings"

export function OwnAvatarsGrid({ avatars, withCreate }: { avatars: Avatar[]; withCreate?: boolean }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {avatars.map((avatar) => (
        <li key={avatar.id}>
          <AvatarCardWithSettings avatar={avatar} />
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
