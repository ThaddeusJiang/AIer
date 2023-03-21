import { OpenAIStream } from '@/utils/openai';
import { createQueryRecord, searchEmbeddings } from '@/utils/supabase-only';

import endent from 'endent';

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '/node_modules/function-bind/**' // use a glob to allow anything in the function-bind 3rd party module
  ]
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { queryFrom, queryTo, query } = (await req.json()) as {
      queryFrom: string;
      queryTo: string;
      query: string;
    };

    const { data: chunks, error } = await searchEmbeddings({
      query,
      queryTo
    });

    if (error) {
      console.error(error);
      return new Response('Error', { status: 500 });
    }

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${query}"

    ${chunks?.map((d: any) => d.content).join('\n\n')}
    `;

    await createQueryRecord({
      from: queryFrom,
      to: queryTo,
      message: query
    });

    const stream = await OpenAIStream({
      queryTo,
      prompt
    });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
