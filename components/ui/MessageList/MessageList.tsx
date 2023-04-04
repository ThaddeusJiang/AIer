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
//       <div className="chat chat-bubble">{message?.message_text}</div>
//     </div>
//   );
// };

const MessageItem = ({ message }: { message: Message }) => {
  const user = useUser();
  return (
    <div className={classNames("w-full flex", user?.id === message.from_id ? " justify-end" : " justify-start")}>
      <div className="max-w-[90%] bg-blue-100  min-h-[2.5rem] rounded-lg px-4 py-2 my-2">
        <article className="prose prose-sm md:prose ">
          <ReactMarkdown children={message?.message_text ?? " "} remarkPlugins={[remarkGfm]} />
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
