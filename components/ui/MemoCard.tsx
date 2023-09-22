import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

import { IconDots } from "@tabler/icons-react"

import classNames from "classnames"
import dayjs from "dayjs"
import remarkGfm from "remark-gfm"

import { Memo } from "~/types"

export const MemoCard = (props: { memo: Memo; onDelete: (id: string) => void; highlight: string }) => {
  const { memo, onDelete, highlight } = props
  const createdAt = dayjs(memo.created_at).format("YYYY-MM-DD HH:mm")

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const words = highlight.trim().split(" ").filter(Boolean)
    words.forEach((word) => {
      let reg = new RegExp(word, "gi")

      if (ref.current && ref.current instanceof HTMLElement) {
        ref.current.innerHTML = ref.current.innerHTML.replace(
          reg,
          (match) => `<span class="bg-yellow-300 text-black">${match}</span>`
        )
      }
    })
  }, [highlight])

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
                  <button
                    className="text-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      onDelete(memo.id)
                    }}
                  >
                    delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <article ref={ref} className="prose md:prose ">
          <ReactMarkdown children={memo?.content ?? ""} remarkPlugins={[remarkGfm]} />
        </article>
      </div>
    </div>
  )
}
