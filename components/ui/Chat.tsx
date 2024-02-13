import { useState } from "react"
import { useForm } from "react-hook-form"
import { useHotkeys } from "react-hotkeys-hook"

import { User } from "@supabase/auth-helpers-react"
import { IconArrowUp } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import classNames from "classnames"
import dayjs from "dayjs"
import produce from "immer"

import { Message } from "~/types"

export function Chat({
  avatar,
  user
}: {
  avatar: {
    id: string
    username: string
    name: string
  }
  user: User | null
}) {
  const [loading, setLoading] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      query: ""
    },
    values: {
      query: ""
    }
  })

  const answerCreateMutation = useMutation({
    mutationFn: async (data: { avatar_id: string; content: string; created_at: string }) => {
      const { avatar_id, content, created_at } = data
      return fetch("/api/answerCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar_id,
          content,
          created_at
        })
      }).then((res) => res.json())
    }
  })

  const handleAnswer = async ({ query }: { query: string }) => {
    function updateMessagesCache(old: { pages: { items: Message[] }[] }, messages: Message[]) {
      const { pages } = old
      const newPages = produce(pages, (draft) => {
        draft[0].items = [...messages.reverse(), ...draft[0].items]
      })

      return {
        ...old,
        pages: newPages
      }
    }

    const messageListCache = queryClient.getQueryData<{ pages: { items: Message[] }[] }>(["messageList", avatar.id])

    // Optimistically update to the new value
    let queryMessage: Message = {
      id: "query_" + crypto.randomUUID(),
      from_id: user!.id,
      to_id: avatar.id,
      content: query,
      created_at: new Date().toISOString()
    }

    let resMessage = {
      id: "answer_" + crypto.randomUUID(),
      from_id: avatar.id,
      to_id: user!.id,
      content: "",
      created_at: new Date().toISOString()
    }

    // @ts-ignore FIXME: fix this
    queryClient.setQueryData(["messageList", avatar.id], (old: TQueryFnData) => {
      const newPages = updateMessagesCache(old, [queryMessage, resMessage])

      return newPages
    })

    setLoading(true)

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        queryFrom: user?.id,
        queryTo: avatar.id,
        query,

        messages: (messageListCache?.pages?.[0]?.items || [])
          .filter((d) => dayjs(d.created_at).isAfter(dayjs().subtract(10, "minutes")))
          .slice(-10)
          .reverse()
          .map((m) => ({
            role: m.from_id === user?.id ? "user" : "assistant",
            content: m.content,
            created_at: m.created_at
          }))
      })
    })

    if (!answerResponse.ok) {
      setLoading(false)
      throw new Error(answerResponse.statusText)
    }

    const data = answerResponse.body

    if (!data) {
      return
    }

    setLoading(false)

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false
    let answer = ""
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      answer += chunkValue

      // @ts-ignore FIXME: fix this
      queryClient.setQueryData(["messageList", avatar.id], (old: TQueryFnData) => {
        const messageList = produce(old, (draft: any) => {
          draft.pages[0].items[0].content = answer
        })
        return messageList
      })
    }

    await answerCreateMutation.mutate({
      avatar_id: avatar.id,
      content: answer,
      created_at: new Date().toISOString()
    })
  }

  useHotkeys(
    "mod+return",
    () => {
      handleSubmit(onSubmit)()
    },
    {
      enableOnFormTags: ["TEXTAREA"]
    }
  )

  const onSubmit = (data: any) => {
    const query = data.query
    handleAnswer({ query })
    reset({
      query: ""
    })
  }

  const query = watch("query")

  return (
    <>
      <form className="form-control relative w-full md:max-w-screen-md" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <textarea
            className="textarea-bordered textarea w-full text-base text-gray-900"
            placeholder={`Hi, I am ${avatar?.name}.\nAsk me anything!`}
            rows={2}
            {...register("query", { required: true })}
          />
        </div>
        {query ? (
          <button
            disabled={loading}
            className=" btn-primary btn-sm btn-circle btn absolute  right-2 bottom-4 mt-4 "
            type="submit"
          >
            <IconArrowUp className="h-6 w-6" />
          </button>
        ) : null}
      </form>

      <div
        className={classNames(" flex justify-end text-xs opacity-0", {
          "  opacity-70 ": query
        })}
      >
        <p className=" hidden md:block">
          Return to add a new line, <kbd className=" kbd kbd-xs">cmd / ctrl</kbd> +&nbsp;
          <kbd className=" kbd kbd-xs">return</kbd> to send message
        </p>
      </div>
    </>
  )
}
