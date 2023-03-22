import { Answer } from '@/components/ui/Answer/Answer';
import { PGChunk } from '@/types';
import { User } from '@supabase/auth-helpers-react';
import { IconArrowUp } from '@tabler/icons-react';
import Head from 'next/head';
import Link from 'next/link';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tweet } from 'react-tweet';

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
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      query: ''
    },
    values: {
      query: ''
    }
  });

  const handleAnswer = async ({ query }: { query: string }) => {
    setAnswer('');
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

    const answerResponse = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

    inputRef.current?.focus();
  };

  const onSubmit = (data: any) => {
    const query = data.query;
    handleAnswer({ query });
  };

  const query = watch('query');

  return (
    <>
      <Head>
        <title>Talk with {avatar?.name}</title>
        <meta
          name="description"
          content={`Talk with ${avatar?.name} on the web. Ask me anything!`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col pb-60">
        <div className="flex-1 ">
          <div className="mx-auto flex w-full max-w-[550px] flex-col items-center px-3 pt-4 sm:pt-8">
            <form
              className="relative w-full mt-4 form-control"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label htmlFor="talkWith" className=" label">
                  Talk with {avatar?.name}
                </label>
                <div className="relative">
                  <textarea
                    className="textarea textarea-lg textarea-bordered focus:outline-none mt-4 w-full text-gray-900 "
                    rows={3}
                    placeholder={`Hi, I am ${avatar?.name}.\nAsk me anything!`}
                    {...register('query', { required: true })}
                  />
                </div>
                {query ? (
                  <button
                    className=" absolute right-2 bottom-4 mt-4 btn  btn-sm btn-primary btn-circle "
                    type="submit"
                  >
                    <IconArrowUp className="h-7 w-7" />
                  </button>
                ) : null}
              </div>
            </form>

            <div className="mt-6 text-center text-lg">
              You can talk to {/* TODO: 一个请求 form */}
              <Link href={`/settings/avatars`} className="link">
                yourself
              </Link>{' '}
              or{' '}
              <Link href={`/avatars`} className="link">
                other avatars
              </Link>{' '}
              anytime.
            </div>

            {loading ? (
              <div className="mt-6 w-full">
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
              <div className="mt-6 w-full">
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
          </div>
        </div>
      </div>
    </>
  );
}
