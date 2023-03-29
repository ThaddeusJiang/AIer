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
      {avatar.avatar_url ? (
        <>
          <div className="avatar">
            <img className="!w-10 rounded-full" src={avatar.avatar_url} alt={`Avatar of ${avatar.name}`} />
          </div>
        </>
      ) : (
        <>
          <div className="avatar placeholder">
            <div className="!w-10 bg-neutral-focus text-neutral-content rounded-full">
              <span className="text-xl">{avatar.name[0]}</span>
            </div>
          </div>
        </>
      )}

      <div>
        <div className="text-base font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name}</div>
        <div className=" text-sm ">@{avatar.username}</div>
      </div>
    </div>
  );
};
