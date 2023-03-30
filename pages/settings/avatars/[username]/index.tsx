import { useForm } from "react-hook-form";

import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { IconArrowUp } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Header } from "~/components/lp/Header";
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader";
import { MemoList } from "~/components/ui/MemoList/MemoList";
import { Avatar } from "~/types";

export default function SettingsAvatarPage({ avatar }: { avatar: Avatar }) {
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      content: "",
      avatar_id: avatar.id
    },
    values: {
      content: "",
      avatar_id: avatar.id
    }
  });

  const queryClient = useQueryClient();

  const memoListQuery = useQuery({
    queryKey: ["memoList", avatar.id],
    queryFn: async () => {
      const res = await fetch("/api/memoList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar_id: avatar.id
        })
      });
      return res.json();
    }
  });

  const createMemoMutation = useMutation({
    mutationFn: async (data: { content: string; avatar_id: string }) => {
      const res = await fetch("/api/memoCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["memoList", avatar.id], (oldData: any) => {
        return {
          items: [data, ...oldData.items]
        };
      });
    }
  });

  const memoDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/memoDelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["memoList", avatar.id], (oldData: any) => {
        const items = oldData?.items?.filter((memo: { id: string }) => memo.id !== data.id);
        return {
          items
        };
      });
    }
  });

  const onDelete = (id: string) => {
    memoDeleteMutation.mutate(id);
  };

  const onSubmit = (data: { content: string; avatar_id: string }) => {
    createMemoMutation.mutate(data);
    reset();
  };

  const memos = memoListQuery.data?.items ?? [];
  const content = watch("content");

  return (
    <>
      <Header />
      <section className="px-2 w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
        <AvatarProfileHeader avatar={avatar} active="memos" />
        <div className="mt-4 px-2 w-full sm:max-w-screen-sm mx-auto max-h-full overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full form-control">
            <input type="hidden" {...register("avatar_id")} />
            <div id="content" className=" relative">
              <textarea
                className="textarea text-base textarea-bordered focus:outline-none w-full text-gray-900 "
                rows={2}
                {...register("content", {
                  required: true
                })}
              />

              <button
                disabled={!content}
                className=" absolute right-2 bottom-4 mt-4 btn  btn-sm btn-primary btn-circle "
                type="submit"
              >
                <IconArrowUp className="h-6 w-6" />
              </button>
            </div>
          </form>

          <MemoList memos={memos} onDelete={onDelete} />
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };
  }

  const { username } = context.params as { username: string };

  const { data, error } = await supabase.from("avatars").select().eq("username", username.toLowerCase());

  const avatar = data?.[0];
  if (avatar?.owner_id !== user.id) {
    return {
      notFound: true
    };
  }

  if (error) {
    console.error(error);
    return {
      props: {
        avatar: null
      }
    };
  }

  if (data.length === 0) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      avatar: data[0]
    }
  };
};