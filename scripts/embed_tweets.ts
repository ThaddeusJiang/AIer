import { PGEssay, PGJSON } from '@/types';
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import readline from 'readline';
import events from 'events';
import { Configuration, OpenAIApi } from 'openai';
import { encode } from 'gpt-3-encoder';

import { Worker, isMainThread, workerData } from 'worker_threads';

loadEnvConfig('');

const source_file = process.env.SOURCE_FILE;
const user_id = process.env.USER_ID;
const source_brand = 'twitter';
const source_username = process.env.SOURCE_USERNAME;

const generateEmbeddings = async (
  essays: PGEssay[],
  start: number,
  end: number,
  user_id: string
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  for (let i = start; i < Math.min(end, essays.length); i++) {
    const section = essays[i];

    for (let j = 0; j < section.chunks.length; j++) {
      const chunk = section.chunks[j];

      const {
        essay_title,
        essay_url,
        essay_date,
        essay_thanks,
        content,
        content_length,
        content_tokens
      } = chunk;

      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: content
      });

      const [{ embedding }] = embeddingResponse.data.data;

      const { data, error } = await supabase
        .from('embeddings')
        .insert({
          user_id,
          source_brand,
          essay_title,
          essay_url,
          essay_date,
          essay_thanks,
          content,
          content_length,
          content_tokens,
          embedding
        })
        .select('*');

      if (error) {
        console.log('error', error);
      } else {
        console.log('saved', i, j);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
};

function tweet2essay(tweetRecord: string) {
  const regex = /^(\d+)\s(.+)\s<(.+)>\s(.+)$/g;
  const [, id, timestamp, username, text] = regex.exec(tweetRecord) || [];

  const essay = {
    title: text,
    url: `https://twitter.com/${username}/status/${id}`,
    date: timestamp,
    thanks: '',
    content: text,
    length: text.length,
    tokens: encode(text).length,
    chunks: [
      {
        essay_title: text,
        essay_url: `https://twitter.com/${username}/status/${id}`,
        essay_date: timestamp,
        essay_thanks: '',
        content: text,
        content_length: text.length,
        content_tokens: encode(text).length,
        embedding: []
      }
    ]
  };

  return essay;
}

(async () => {
  if (!source_file || !user_id) {
    console.error('params is invalid.');
    return;
  }
  const rl = readline.createInterface({
    input: fs.createReadStream(source_file),
    crlfDelay: Infinity
  });

  const essays: PGEssay[] = [];
  rl.on('line', (line) => {
    const essay = tweet2essay(line);
    essays.push(essay);
  });
  await events.once(rl, 'close');

  if (isMainThread) {
    const workerCount = 200;
    const totalCount = essays.length;
    const tasksPerWorker = Math.ceil(totalCount / workerCount);
    console.log('total', totalCount, 'tasksPerWorker', tasksPerWorker);

    for (let i = 0; i < workerCount; i++) {
      const start = i * tasksPerWorker;
      const end = Math.min(start + tasksPerWorker, totalCount);

      new Worker(__filename, {
        workerData: { start, end }
      });
    }
  } else {
    const { start, end } = workerData as { start: number; end: number };

    console.log('start embedding', user_id, source_file, start, end);
    await generateEmbeddings(essays, start, end, user_id);
  }
})();
