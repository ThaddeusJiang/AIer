import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";

import { GetServerSidePropsContext } from "next";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { IconArrowUp } from "@tabler/icons-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import classNames from "classnames";
import produce from "immer";

import { Header } from "~/components/lp/Header";
import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader";
import { AvatarProfileTabs } from "~/components/ui/Avatar/AvatarProfileTabs";
import { MemoCard } from "~/components/ui/MemoCard/MemoCard";
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

  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["memoList", avatar.id],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch("/api/memoList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar_id: avatar.id,
          cursor: pageParam
        })
      });
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const memoCreateMutation = useMutation({
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
      queryClient.setQueryData(["memoList", avatar.id], (old: any) => {
        const memoList = produce(old, (draft: any) => {
          draft.pages[0].items.unshift(data);
        });
        return memoList;
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
    memoCreateMutation.mutate(data);
    reset();
  };

  const content = watch("content");

  return (
    <>
      <Header />
      <section className="mx-auto max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
        <AvatarProfileHeader avatar={avatar} />
        <AvatarProfileTabs avatar={avatar} active="memos" />
        <div className="mx-auto mt-4 max-h-full w-full overflow-y-auto px-2 sm:max-w-screen-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="form-control w-full">
            <input type="hidden" {...register("avatar_id")} />
            <div id="content" className=" relative">
              <textarea
                className="textarea-bordered textarea w-full text-base text-gray-900 focus:outline-none "
                placeholder="What are you thinking?"
                rows={2}
                {...register("content", {
                  required: true
                })}
              />

              <button
                disabled={!content || memoCreateMutation.isLoading}
                className={classNames(" btn-primary btn-sm btn-circle btn absolute  right-2 bottom-4 mt-4 ", {
                  " loading": memoCreateMutation.isLoading
                })}
                type="submit"
              >
                {memoCreateMutation.isLoading ? null : <IconArrowUp className="h-6 w-6" />}
              </button>
            </div>
          </form>

          {memoCreateMutation.isLoading ? <p className="text-center text-gray-500">creating...</p> : null}

          {data?.pages?.map(({ items, nextCursor }) => (
            <Fragment key={nextCursor}>
              {items?.map((project: any) => (
                <MemoCard key={project.id} memo={project} onDelete={onDelete} />
              ))}
            </Fragment>
          ))}

          {status === "error" ? <p className="text-center text-red-500">error</p> : null}

          <div ref={ref} className="pb-12 text-center text-gray-500">
            {status === "loading"
              ? "loading..."
              : isFetchingNextPage
              ? "load more..."
              : hasNextPage
              ? "load newer"
              : "no more"}
          </div>

          {/* TODO: 学习一下这个状态是什么意思？ */}
          {/* <div>
            {isFetching && !isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div> */}
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
