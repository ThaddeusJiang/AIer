import Link from "next/link";

import classNames from "classnames";

export const AvatarProfileTabs = ({ username, active = "memo" }: { username: string; active?: string }) => {
  return (
    <>
      <nav className="tabs flex w-full  font-bold">
        <Link
          href={`/settings/avatars/${username}`}
          className={classNames("tab-bordered tab tab-lg flex-1", {
            "tab-active": active === "memos"
          })}
        >
          MEMO
        </Link>
        <Link
          href={`/settings/avatars/${username}/replies`}
          className={classNames("tab-bordered tab tab-lg flex-1", {
            "tab-active": active === "replies"
          })}
        >
          Replies
        </Link>
        <Link
          href={`/settings/avatars/${username}/api`}
          className={classNames("tab-bordered tab tab-lg flex-1", {
            "tab-active": active === "api"
          })}
        >
          API
        </Link>
      </nav>
    </>
  );
};
