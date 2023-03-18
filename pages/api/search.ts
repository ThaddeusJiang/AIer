import { createQueryRecord, supabaseAdmin } from '@/utils/supabase-admin';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   runtime: 'edge'
// };

const apiKey = process.env.OPENAI_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401);
  }

  try {
    const { query, matches, queryTo } = (await req.body) as {
      query: string;
      matches: number;
      queryTo: string;
    };

    const input = query.replace(/\n/g, ' ');

    await createQueryRecord({
      queryFrom: user.id,
      queryTo,
      queryText: input
    });

    const embeddingsJson = await fetch('https://api.openai.com/v1/embeddings', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input
      })
    });

    const json = await embeddingsJson.json();
    const embedding = json.data[0].embedding;

    const { data: chunks, error } = await supabaseAdmin.rpc(
      'embeddings_search',
      {
        query_embedding: embedding,
        similarity_threshold: 0.01,
        match_count: matches,
        query_to: queryTo
      }
    );

    if (error) {
      console.error(error);
      // return new Response('Error', { status: 500 });
      return res.status(500);
    }

    // return new Response(JSON.stringify(chunks), { status: 200 });
    return res.status(200).json(chunks);
  } catch (error) {
    console.error(error);
    // return new Response('Error', { status: 500 });
    return res.status(500);
  }
};

export default handler;
