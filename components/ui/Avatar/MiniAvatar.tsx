import { Avatar } from "~/types";

export const MiniAvatar = ({ avatar }: { avatar: Avatar }) => {
  return (
    <div className="flex space-x-2 items-center">
      {avatar?.avatar_url ? (
        <>
          <div className="avatar">
            <img
              className="!w-12 !h-12 sm:!w-16 sm:!h-16 rounded-full"
              src={avatar.avatar_url}
              alt={`Avatar of ${avatar.name}`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="avatar placeholder">
            <div className="!w-12 !h-12 sm:!w-16 sm:!h-16 rounded-full bg-neutral-focus text-neutral-content ">
              <span className="text-xl">{avatar.name[0]}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
