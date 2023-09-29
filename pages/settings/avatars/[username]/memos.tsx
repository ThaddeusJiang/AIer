import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useHotkeys } from "react-hotkeys-hook"
import { useInView } from "react-intersection-observer"

import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { IconArrowUp } from "@tabler/icons-react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import classNames from "classnames"
import produce from "immer"

import { AvatarProfileHeader } from "~/components/ui/Avatar/AvatarProfileHeader"
import { MainLayout } from "~/components/ui/Layouts/MainLayout"
import { MemoCard } from "~/components/ui/MemoCard"
import { MemoSearchForm } from "~/components/ui/MemoSearchForm"
import { Avatar } from "~/types"

export default function SettingsAvatarMemoPage({ avatar }: { avatar: Avatar }) {
  const router = useRouter()
  const { username } = router.query as { username: string }

  const [q, setQ] = useState("")

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      content: "",
      avatar_id: avatar.id
    },
    values: {
      content: "",
      avatar_id: avatar.id
    }
  })

  const { ref, inView } = useInView()
  const queryClient = useQueryClient()

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["memoList", avatar.id, q],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch("/api/memoList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar_id: avatar.id,
          cursor: pageParam,
          q
        })
      })

      return res.json()
    },
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  const memoCreateMutation = useMutation({
    mutationFn: async (data: { content: string; avatar_id: string }) => {
      const res = await fetch("/api/memoCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["memoList", avatar.id, q], (old: any) => {
        const memoList = produce(old, (draft: any) => {
          draft.pages[0].items.unshift(data)
          draft.pages[0].count += 1
        })
        return memoList
      })
    }
  })

  const memoDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/memoDelete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      }).then((res) => res.json())
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["memoList", avatar.id, q], (old: any) => {
        const memoList = produce(old, (draft: any) => {
          for (let i = 0; i < draft.pages.length; i++) {
            const items = draft.pages[i].items.filter((memo: { id: string }) => memo.id !== data.id)
            if (items.length !== draft.pages[i].items.length) {
              draft.pages[i].items = items
              break
            }
          }
          draft.pages[0].count -= 1
        })

        return memoList
      })
    }
  })

  const onDelete = (id: string) => {
    memoDeleteMutation.mutate(id)
  }

  useHotkeys(
    "mod+return",
    () => {
      handleSubmit(onCreate)()
    },
    {
      enableOnFormTags: ["TEXTAREA"]
    }
  )

  const onCreate = (data: { content: string; avatar_id: string }) => {
    memoCreateMutation.mutate(data)
    reset()
  }

  const content = watch("content")
  const count = data?.pages?.[0]?.count ?? 0

  return (
    <>
      <MainLayout>
        <AvatarProfileHeader username={username} isSetting={true} />

        <div className="mx-auto mt-4 max-h-full w-full overflow-y-auto sm:max-w-screen-sm">
          <MemoSearchForm text={q} onSearch={setQ} />

          <form onSubmit={handleSubmit(onCreate)} className="form-control w-full py-1">
            <input type="hidden" {...register("avatar_id")} />
            <div id="content" className=" relative">
              <textarea
                className="textarea-bordered textarea w-full text-base text-gray-900 focus:shadow focus:outline-none"
                placeholder="What are you thinking?"
                rows={2}
                {...register("content", {
                  required: true
                })}
              />

              {content ? (
                <button
                  disabled={memoCreateMutation.isLoading}
                  className={classNames(" btn-primary btn-sm btn-circle btn absolute  right-2 bottom-4 mt-4 ", {
                    " loading": memoCreateMutation.isLoading
                  })}
                  type="submit"
                >
                  {memoCreateMutation.isLoading ? null : <IconArrowUp className="h-6 w-6" />}
                </button>
              ) : null}
            </div>

            <div
              className={classNames(" flex justify-end text-xs opacity-0", {
                "  opacity-70 ": content
              })}
            >
              <p className=" hidden md:block">
                Return to add a new line, <kbd className=" kbd kbd-xs">cmd / ctrl</kbd> +&nbsp;
                <kbd className=" kbd kbd-xs">return</kbd> to save memo
              </p>
            </div>
          </form>

          {memoCreateMutation.isLoading ? <p className="text-center text-gray-500">creating...</p> : null}

          {status === "loading" ? (
            <p className=" text-gray-500">Loading...</p>
          ) : (
            <p className=" text-gray-500">Find {count} memos</p>
          )}
          {status === "error" ? <p className="text-center text-red-500">error</p> : null}

          {data?.pages?.map(({ items, nextCursor }) => (
            <Fragment key={nextCursor ?? "no-more"}>
              {items?.map((project: any) => (
                <MemoCard key={project.id} memo={project} onDelete={onDelete} highlight={q} />
              ))}
            </Fragment>
          ))}

          <div ref={ref} className="pb-12 text-center text-gray-500">
            {isFetchingNextPage
              ? "load more..."
              : hasNextPage
              ? null
              : (data?.pages?.length ?? 0) > 1
              ? "no more"
              : null}
          </div>

          {/* TODO: 学习一下这个状态是什么意思？ */}
          {/* <div>
            {isFetching && !isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div> */}
        </div>
      </MainLayout>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(context)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    }
  }

  const { username } = context.params as { username: string }
  const avatar_username = username?.toLocaleLowerCase()

  const { data, error } = await supabase.from("avatars").select().eq("username", avatar_username)

  const avatar = data?.[0]
  if (avatar?.owner_id !== user.id) {
    return {
      notFound: true
    }
  }

  if (error) {
    console.error(error)
    return {
      props: {
        avatar: null
      }
    }
  }

  if (data.length === 0) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      avatar: data[0]
    }
  }
}
