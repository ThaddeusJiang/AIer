import Link from "next/link";

export const MiniAvatar = ({
  avatar
}: {
  avatar: {
    id: string;
    username: string;
    name: string;
    desc?: string;
    avatar_url?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
  };
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <div className="avatar">
        <div className="w-8 rounded-full ring ring-offset-base-100 ring-offset-2">
          <img src={avatar.avatar_url ?? "https://www.gravatar.com/avatar/ANY"} />
        </div>
      </div>

      <div>
        <div className="text-base font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name}</div>
        <div className=" text-sm ">@{avatar.username}</div>
      </div>
    </div>
  );
};
