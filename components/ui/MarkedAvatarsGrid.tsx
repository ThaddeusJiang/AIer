import { Avatar } from "~/types"

import { AvatarCardWithMarkIcon } from "./Avatar/AvatarCardWithMarkIcon"

export function MarkedAvatarsGrid({
  avatars
}: {
  avatars: (Avatar & {
    isMarked: boolean
  })[]
}) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {avatars.map((avatar) => (
        <li key={avatar.id}>
          <AvatarCardWithMarkIcon avatar={avatar} />
        </li>
      ))}
    </ul>
  )
}
