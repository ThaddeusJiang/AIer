import ReactMarkdown from "react-markdown";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";

import { useUser } from "@supabase/auth-helpers-react";

import classNames from "classnames";
import remarkGfm from "remark-gfm";

import { Message } from "~/types";

// const MessageItem = ({ data, index, style }: { data: any[]; index: number; style: any }) => {
//   const user = useUser();
//   const message = data[index];
//   return (
//     <div style={style} className={classNames("w-full chat", user?.id === message.from_id ? "chat-end" : "chat-start")}>
//       <div className="chat chat-bubble">{message?.content}</div>
//     </div>
//   );
// };

const MessageItem = ({ message }: { message: Message }) => {
  const user = useUser();
  return (
    <div className={classNames("flex w-full", user?.id === message.from_id ? " justify-end" : " justify-start")}>
      <div className="my-2 min-h-[2.5rem]  max-w-[90%] rounded-lg bg-blue-100 px-4 py-2">
        <article className="prose-sm prose md:prose ">
          <ReactMarkdown children={message?.content ?? " "} remarkPlugins={[remarkGfm]} />
        </article>
      </div>
    </div>
  );
};

export const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      {/* <AutoSizer>
        {({ height, width }) => (
          <List
            className="mx-auto pb-20"
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={getItemSize}
            itemData={messages}
          >
            {MessageItem}
          </List>
        )}
      </AutoSizer> */}

      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </>
  );
};
