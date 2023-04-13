import { toast } from "react-hot-toast";

import Image from "next/image";
import Link from "next/link";

import { IconDots, IconMessage } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "~/utils/useUser";

export const AvatarProfileHeader = ({ username }: { username: string }) => {
  const { user } = useUser();

  const avatarReadQuery = useQuery({
    queryKey: ["avatarRead", username],
    queryFn: async () => {
      const res = await fetch(`/api/avatarRead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });
      return res.json();
    }
  });

  const queryClient = useQueryClient();

  const avatar = avatarReadQuery.data;

  const editable = user?.id === avatar?.owner_id;

  const changeStatusMutation = useMutation({
    mutationFn: async (data: { status: string; username: string }) => {
      const res = await fetch("/api/avatarUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["avatarRead", username], (old: any) => {
        return data;
      });

      toast.success("Avatar status updated");
    }
  });

  const changeStatus = () => {
    changeStatusMutation.mutate({ status: avatar?.status !== "public" ? "public" : "private", username });
  };

  return (
    <>
      <header className="relative">
        <div>
          <Image
            src="https://source.unsplash.com/random/800x600?orientation=landscape&query=nature"
            alt="avatar's profile background image"
            width={800}
            height={600}
            className="max-h-28 w-full object-cover object-center"
          />
        </div>
        <div className="relative">
          <div className=" absolute -bottom-14 left-4">
            {avatar?.avatar_url ? (
              <>
                <div className="avatar">
                  <img
                    className="!h-28 !w-28 rounded-full"
                    src={avatar?.avatar_url}
                    alt={`Avatar of ${avatar?.name}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="placeholder avatar">
                  <div className="!h-28 !w-28 rounded-full bg-neutral-focus text-neutral-content">
                    <span className="text-4xl">{avatar?.name[0]}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className=" absolute top-4 right-4">
            <div className="flex w-1/2 items-center space-x-4">
              {editable && (
                <div className="dropdown-end dropdown">
                  <label tabIndex={0} className="btn-outline btn-sm btn-circle  btn m-1">
                    <IconDots className="h-5 w-5" />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow">
                    <li>
                      <button onClick={changeStatus}>
                        change to {avatar?.status !== "public" ? "public" : "private"}
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <Link href={`/chat/${avatar?.username}`} className=" btn-primary btn-sm  btn gap-2">
                <IconMessage className="h-5 w-5 " />
                <span className="text-sm">Chat</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="ml-4 mt-14">
          <div className="flex items-center space-x-3">
            <h3 className=" text-2xl font-semibold leading-7 tracking-tight text-gray-900">{avatar?.name}</h3>
            {avatar?.status !== "public" ? (
              <span className="inline-block flex-shrink-0 rounded-full bg-slate-300 px-2 py-0.5 text-xs font-medium text-slate-800">
                {avatar?.status}
              </span>
            ) : null}
          </div>
          <h4 className=" text-sm ">@{avatar?.username}</h4>
          <p className="mt-2 text-sm leading-6 text-gray-600">{avatar?.bio}</p>
        </div>
      </header>
    </>
  );
};
