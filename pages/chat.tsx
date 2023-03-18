import { Answer } from '@/components/ui/Answer/Answer';
import { PGChunk } from '@/types';
import { useUser } from '@/utils/useUser';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { IconArrowRight } from '@tabler/icons-react';
import endent from 'endent';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tweet } from 'react-tweet';

export default function Chat({
  availableReplicas
}: {
  availableReplicas: {
    sourceId: string;
    sourceBrand: string;
    sourceUsername: string;
  }[];
}) {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      router.replace('/signin');
    }
  }, [user]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [chunks, setChunks] = useState<PGChunk[]>([]);
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const matchCount = 5;

  const { register, handleSubmit } = useForm();

  const handleAnswer = async ({
    talkWith,
    query
  }: {
    talkWith: string;
    query: string;
  }) => {
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
        matches: matchCount,
        queryTo: talkWith
      })
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: PGChunk[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join('\n\n')}
    `;

    const answerResponse = await fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
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
    const talkWith = data.talkWith;
    handleAnswer({ query, talkWith });
  };

  return (
    <>
      <Head>
        {/* TODO: */}
        <title>Chat with Thaddeus Jiang</title>
        <meta
          name="description"
          content={`AI-powered search and chat for Thaddeus Jiang.`}
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
              <div className="flex w-full justify-start space-x-2 items-center">
                <label htmlFor="talkWith" className=" label">
                  Talk with
                </label>
                <select
                  {...register('talkWith')}
                  className="select select-bordered text-gray-900 select-sm"
                >
                  {availableReplicas.map((d) => {
                    return (
                      <option key={d.sourceUsername} value={d.sourceId}>
                        {d.sourceBrand}/{d.sourceUsername}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <textarea
                  className="textarea textarea-bordered mt-4 w-full text-gray-900 "
                  rows={3}
                  placeholder="How TJ view the TypeScript?"
                  {...register('query', { required: true })}
                />
              </div>

              <div className="flex w-full justify-end">
                <button className="mt-4  " type="submit">
                  <IconArrowRight className=" h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:h-10 sm:w-10 text-white" />
                </button>
              </div>
            </form>

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
              <div className="mt-6">
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
            ) : (
              <div className="mt-6 text-center text-lg">{`You can talk to yourself or chat with AIers anytime.`}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };
  }

  return {
    props: {
      availableReplicas: [
        {
          sourceId: 'd9655e45-0bb7-4610-9d42-52059214c7a1',
          sourceBrand: 'Twitter',
          sourceUsername: 'ThaddeusJiang'
        },
        {
          sourceId: 'abb9e761-9f0d-4d3a-b201-bf40f19a5474',
          sourceBrand: 'Twitter',
          sourceUsername: 'mieisgood'
        }
      ]
    }
  };
};
