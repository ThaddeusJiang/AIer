import Image from "next/image";
import Link from "next/link";

import { IconMessage } from "@tabler/icons-react";

import { Avatar } from "~/types";

export const AvatarProfileHeader = ({ avatar, edit = false }: { avatar: Avatar; edit?: boolean }) => {
  return (
    <>
      <header className="relative">
        <div>
          <Image
            src="https://source.unsplash.com/random/800x600?orientation=landscape&query=nature"
            alt="avatar's profile background image"
            width={800}
            height={600}
            className="w-full max-h-28 object-cover object-center"
          />
        </div>
        <div className="relative">
          <div className=" absolute -bottom-14 left-4">
            {avatar.avatar_url ? (
              <>
                <div className="avatar">
                  <img className="!w-28 !h-28 rounded-full" src={avatar.avatar_url} alt={`Avatar of ${avatar.name}`} />
                </div>
              </>
            ) : (
              <>
                <div className="avatar placeholder">
                  <div className="!w-28 !h-28 bg-neutral-focus text-neutral-content rounded-full">
                    <span className="text-4xl">{avatar.name[0]}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className=" absolute top-4 right-4">
            <Link href={`/chat/${avatar.username}`} className="btn gap-1 btn-primary ">
              <IconMessage className="h-5 w-5 " />
              <span>Chat</span>
            </Link>
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

        <div className="ml-4 mt-14">
          <h3 className=" text-2xl font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name}</h3>
          <h4 className=" text-sm ">@{avatar.username}</h4>
          <p className="text-sm mt-2 leading-6 text-gray-600">{avatar.bio}</p>
        </div>
      </header>
    </>
  );
};
