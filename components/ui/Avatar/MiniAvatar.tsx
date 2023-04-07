import { Avatar } from "~/types";

export const MiniAvatar = ({ avatar }: { avatar: Avatar }) => {
  return (
    <div className="flex items-center space-x-2">
      {avatar?.avatar_url ? (
        <>
          <div className="avatar">
            <img
              className="!h-12 !w-12 rounded-full sm:!h-16 sm:!w-16"
              src={avatar.avatar_url}
              alt={`Avatar of ${avatar.name}`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="placeholder avatar">
            <div className="!h-12 !w-12 rounded-full bg-neutral-focus text-neutral-content sm:!h-16 sm:!w-16 ">
              <span className="text-xl">{avatar.name[0]}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
