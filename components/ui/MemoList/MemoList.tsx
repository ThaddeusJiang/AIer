import ReactMarkdown from "react-markdown";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";

import { useUser } from "@supabase/auth-helpers-react";
import { IconDots } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import classNames from "classnames";
import dayjs from "dayjs";
import remarkGfm from "remark-gfm";

import { Memo } from "~/types";

const MemoItem = ({ memo, onDelete }: { memo: Memo; onDelete: (id: string) => void }) => {
  const createdAt = dayjs(memo.created_at).format("YYYY-MM-DD HH:mm");
  return (
    <div className={classNames("w-full")}>
      <div className="rounded-lg px-4 py-2 my-2 hover:shadow bg-blue-100">
        <div className="flex justify-between">
          <p className="text-xs text-gray-600">{createdAt}</p>
          <div className="dropdown dropdown-end">
            <label tabIndex={0}>
              <IconDots className="w-4 " />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box ">
              <li>
                <a
                  className="text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(memo.id);
                  }}
                >
                  delete
                </a>
              </li>
            </ul>
          </div>
        </div>
        <article className="prose prose-sm md:prose ">
          <ReactMarkdown children={memo?.content ?? ""} remarkPlugins={[remarkGfm]} />
        </article>
      </div>
    </div>
  );
};

export const MemoList = ({ memos, onDelete }: { memos: Memo[]; onDelete: (id: string) => void }) => {
  return (
    <>
      {memos.map((memo) => (
        <MemoItem key={memo.id} memo={memo} onDelete={onDelete} />
      ))}
    </>
  );
};
