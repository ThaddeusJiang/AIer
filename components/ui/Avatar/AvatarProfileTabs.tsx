import Link from "next/link"

import classNames from "classnames"

import { Avatar } from "~/types"

/**
 * @deprecated
 */
export const AvatarProfileTabs = ({ avatar, active = "memos" }: { avatar: Avatar; active?: string }) => {
  return (
    <>
      <nav className="tabs flex w-full  font-bold">
        <Link
          href={`/settings/avatars/${avatar.username}/memos`}
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
