import Link from "next/link"

import classNames from "classnames"

import { Avatar } from "~/types"

export const AvatarProfileTabs = ({ avatar, active = "memo" }: { avatar: Avatar; active?: string }) => {
  return (
    <>
      <nav className="tabs flex w-full  font-bold">
        <Link
          href={`/settings/avatars/${avatar.username}`}
          className={classNames("tab-bordered tab tab-lg flex-1", {
            "tab-active": active === "memos"
          })}
        >
          MEMO
        </Link>
        <Link
          href={`/settings/avatars/${avatar.username}/replies`}
          className={classNames("tab-bordered tab tab-lg flex-1", {
            "tab-active": active === "replies"
          })}
        >
          Replies
        </Link>
        <Link
          href={`/settings/avatars/${avatar.username}/api`}
          className={classNames("tab-bordered tab tab-lg flex-1", {
            "tab-active": active === "api"
          })}
        >
          API
        </Link>
      </nav>
    </>
  )
}
