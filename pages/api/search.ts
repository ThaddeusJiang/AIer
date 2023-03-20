import { searchEmbeddings } from '@/utils/supabase-admin';

import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   runtime: 'edge'
// };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query, queryTo } = (await req.body) as {
      query: string;
      queryTo: string;
    };

    const { data: chunks, error } = await searchEmbeddings({
      query,
      queryTo
    });

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
