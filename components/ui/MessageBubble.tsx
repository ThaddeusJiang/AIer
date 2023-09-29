import ReactMarkdown from "react-markdown"

import { useUser } from "@supabase/auth-helpers-react"

import classNames from "classnames"
import remarkGfm from "remark-gfm"

import { Message } from "~/types"

export const MessageBubble = ({ message }: { message: Message }) => {
  const user = useUser()
  return (
    <div className={classNames("flex w-full", user?.id === message.from_id ? " justify-end" : " justify-start")}>
      <div className="my-2 min-h-[2.5rem]  max-w-[90%] overflow-auto rounded-lg bg-blue-100 px-4 py-2 ">
        <article className="prose break-keep md:prose">
          <ReactMarkdown children={message?.content ?? " "} remarkPlugins={[remarkGfm]} />
        </article>
      </div>
    </div>
  )
}
