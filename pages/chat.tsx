import { Answer } from '@/components/ui/Answer/Answer';
import { PGChunk } from '@/types';
import { useUser } from '@/utils/useUser';
import { IconArrowRight } from '@tabler/icons-react';
import endent from 'endent';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tweet } from 'react-tweet';

export default function Chat() {
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

  const handleAnswer = async (query: string) => {
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
        queryTo: user?.id
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
    handleAnswer(query);
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
          <div className="mx-auto flex w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
            <form
              className="relative w-full mt-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <textarea
                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-4 sm:leading-6 text-lg"
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
              <div className="mt-6 text-center text-lg">{`AIer - an AI avatar, digital immortality.`}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
