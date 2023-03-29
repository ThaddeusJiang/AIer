import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Tweet } from "react-tweet";

import { User } from "@supabase/auth-helpers-react";
import { IconArrowUp } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

import { Answer } from "~/components/ui/Answer/Answer";
import { PGChunk } from "~/types";

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
  const [chunks, setChunks] = useState<PGChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
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

  const handleAnswer = async ({ query }: { query: string }) => {
    // Optimistically update to the new value
    let queryMessage = {
      id: "query_" + new Date().getTime(),
      from_id: user?.id,
      to_id: avatar.id,
      message_text: query
    };

    let resMessage = {
      id: "answer_waiting",
      from_id: avatar.id,
      to_id: user?.id,
      message_text: "..."
    };
    // @ts-ignore FIXME: fix this
    queryClient.setQueryData(["listMessages", avatar.id], (old: TQueryFnData) => ({
      items: [...old.items, queryMessage, resMessage]
    }));
    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        queryTo: avatar.id
      })
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: PGChunk[] = await searchResponse.json();

    setChunks(results);

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ queryFrom: user?.id, queryTo: avatar.id, query })
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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }

    queryClient.refetchQueries(["listMessages", avatar.id]);

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
      <form className="relative w-full sm:max-w-screen-sm form-control" onSubmit={handleSubmit(submit)}>
        <div className="relative">
          <textarea
            className="textarea text-base textarea-bordered focus:outline-none w-full text-gray-900 "
            placeholder={`Hi, I am ${avatar?.name}.\nAsk me anything!`}
            rows={2}
            {...register("query", { required: true })}
          />
        </div>
        {query ? (
          <button className=" absolute right-2 bottom-4 mt-4 btn  btn-sm btn-primary btn-circle " type="submit">
            <IconArrowUp className="h-6 w-6" />
          </button>
        ) : null}
      </form>

      {loading ? (
        <div className="mt-6 w-full hidden">
          <div className="font-bold text-2xl">Answer</div>
          <div className="animate-pulse mt-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
          </div>

          <div className="font-bold text-2xl mt-6">Passages</div>
          <div className="animate-pulse mt-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
            <div className="h-4 bg-gray-300 rounded mt-2"></div>
          </div>
        </div>
      ) : answer ? (
        <div className="mt-6 w-full hidden">
          <div className="font-bold text-2xl mb-2">Answer</div>
          <Answer text={answer} />

          <div className="mt-6 mb-16 ">
            <div className="font-bold text-2xl">Passages</div>
            {/* <div className="block lg:grid  lg:grid-cols-2 lg:gap-4"> */}
            <div className="mx-auto w-full">
              {chunks.map((chunk, index) => {
                const { essay_url } = chunk;

                const [tweetId] = /\/[0-9]+$/.exec(essay_url) || [];
                return tweetId ? (
                  <div key={index}>
                    <Tweet id={(tweetId as string).slice(1)} />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
