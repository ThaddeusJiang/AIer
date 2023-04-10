import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { User } from "@supabase/auth-helpers-react";
import { IconArrowUp } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import produce from "immer";

import { Message } from "~/types";

export function Chat({
  avatar,
  user
}: {
  avatar: {
    id: string;
    username: string;
    name: string;
  };
  user: User | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      query: ""
    },
    values: {
      query: ""
    }
  });

  const answerCreateMutation = useMutation({
    mutationFn: async ({ avatar_id, content }: { avatar_id: string; content: string }) => {
      return fetch("/api/answerCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          avatar_id,
          content
        })
      }).then((res) => res.json());
    }
  });

  const handleAnswer = async ({ query }: { query: string }) => {
    const messageList = queryClient.getQueryData<{ items: Message[] }>(["messageList", avatar.id]);
    // Optimistically update to the new value
    let queryMessage = {
      id: "query_" + crypto.randomUUID(),
      from_id: user?.id,
      to_id: avatar.id,
      content: query
    };

    let resMessage = {
      id: "answer_" + crypto.randomUUID(),
      from_id: avatar.id,
      to_id: user?.id,
      content: ""
    };
    // @ts-ignore FIXME: fix this
    queryClient.setQueryData(["messageList", avatar.id], (old: TQueryFnData) => ({
      items: [...old.items, queryMessage, resMessage]
    }));
    setLoading(true);
    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        queryFrom: user?.id,
        queryTo: avatar.id,
        query,
        messages: (messageList?.items.slice(-10) || []).map((m) => ({
          role: m.from_id === user?.id ? "user" : "assistant",
          content: m.content
        }))
      })
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let answer = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      answer += chunkValue;

      // @ts-ignore FIXME: fix this
      queryClient.setQueryData(["messageList", avatar.id], (old: TQueryFnData) => {
        const messageList = produce(old, (draft: any) => {
          draft.items[draft.items.length - 1].content = answer;
        });
        return messageList;
      });
    }

    await answerCreateMutation.mutate({
      avatar_id: avatar.id,
      content: answer
    });

    inputRef.current?.focus();
  };

  const submit = (data: any) => {
    const query = data.query;
    handleAnswer({ query });
    reset({
      query: ""
    });
  };

  const query = watch("query");

  return (
    <>
      <form className="form-control relative w-full sm:max-w-screen-sm" onSubmit={handleSubmit(submit)}>
        <div className="relative">
          <textarea
            className="textarea-bordered textarea w-full text-base text-gray-900 focus:outline-none "
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
    </>
  );
}
