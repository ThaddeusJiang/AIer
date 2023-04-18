import ReactMarkdown from "react-markdown"

import { IconDots } from "@tabler/icons-react"

import classNames from "classnames"
import dayjs from "dayjs"
import remarkGfm from "remark-gfm"

import { Memo } from "~/types"

export const MemoCard = ({ memo, onDelete }: { memo: Memo; onDelete: (id: string) => void }) => {
  const createdAt = dayjs(memo.created_at).format("YYYY-MM-DD HH:mm")
  return (
    <div className={classNames("w-full")}>
      <div className="my-2 rounded-lg bg-base-100 px-4 py-2 hover:shadow ">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">{createdAt}</p>
          <div className="flex items-center space-x-1">
            <div className="dropdown-end dropdown">
              <label tabIndex={0}>
                <IconDots className="w-4 " />
              </label>
              <ul tabIndex={0} className="dropdown-content menu rounded-box menu-compact bg-base-100 p-2 shadow ">
                <li>
                  <a
                    className="text-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      onDelete(memo.id)
                    }}
                  >
                    delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <article className="prose md:prose ">
          <ReactMarkdown children={memo?.content ?? ""} remarkPlugins={[remarkGfm]} />
        </article>
      </div>
    </div>
  )
}
