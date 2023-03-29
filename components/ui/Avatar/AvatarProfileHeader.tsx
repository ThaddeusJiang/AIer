import Image from "next/image";
import Link from "next/link";

import classNames from "classnames";

import { Avatar } from "~/types";

export const AvatarProfileHeader = ({
  avatar,
  edit = false,
  active = "memo"
}: {
  avatar: Avatar;
  edit?: boolean;
  active?: string;
}) => {
  return (
    <>
      <header className="relative">
        <div>
          <Image
            src="https://source.unsplash.com/random/800x600?orientation=landscape&query=nature"
            alt="avatar's profile background image"
            width={800}
            height={600}
            className="w-full max-h-40 object-cover object-center"
          />
        </div>
        <div className="relative">
          <div className=" absolute -bottom-10 left-4">
            {avatar.avatar_url ? (
              <>
                <div className="avatar">
                  <img className="!w-20 rounded-full" src={avatar.avatar_url} alt={`Avatar of ${avatar.name}`} />
                </div>
              </>
            ) : (
              <>
                <div className="avatar placeholder">
                  <div className="!w-20 bg-neutral-focus text-neutral-content rounded-full">
                    <span className="text-4xl">{avatar.name[0]}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {edit && (
            <Link
              href={`/settings/avatars/${avatar.username}/edit`}
              className="btn btn-primary absolute -bottom-10 right-4"
            >
              Edit
            </Link>
          )}
        </div>

        <div className="ml-4 mt-12">
          <h3 className=" text-2xl font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name}</h3>
          <h4 className=" text-sm ">@{avatar.username}</h4>
          <p className="text-sm mt-2 leading-6 text-gray-600">{avatar.bio}</p>
        </div>

        <nav className="tabs w-full flex">
          <Link
            href={`/settings/avatars/${avatar.username}`}
            className={classNames("tab tab-lg flex-1 tab-bordered", {
              "tab-active": active === "memos"
            })}
          >
            Memos
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
      </header>
    </>
  );
};
