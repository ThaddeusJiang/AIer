import Link from "next/link";

import classNames from "classnames";

import { Avatar } from "~/types";

export const AvatarProfileTabs = ({ avatar, active = "memo" }: { avatar: Avatar; active?: string }) => {
  return (
    <>
      <nav className="tabs w-full flex  font-bold">
        <Link
          href={`/settings/avatars/${avatar.username}`}
          className={classNames("tab tab-lg flex-1 tab-bordered", {
            "tab-active": active === "memos"
          })}
        >
          MEMO
        </Link>
        <Link
          href={`/settings/avatars/${avatar.username}/replies`}
          className={classNames("tab tab-lg flex-1 tab-bordered", {
            "tab-active": active === "replies"
          })}
        >
          Replies
        </Link>
      </nav>
    </>
  );
};
