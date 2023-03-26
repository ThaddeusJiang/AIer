import ReactMarkdown from "react-markdown";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";

import { useUser } from "@supabase/auth-helpers-react";

import classNames from "classnames";

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
    <div className={classNames("w-full chat", user?.id === message.from_id ? "chat-end" : "chat-start")}>
      <div className="chat chat-bubble">
        <ReactMarkdown>{message?.message_text ?? ""}</ReactMarkdown>
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
