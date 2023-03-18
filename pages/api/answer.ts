import { OpenAIStream } from '@/utils/openai';

export const config = {
  runtime: 'edge'
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { queryTo, prompt } = (await req.json()) as {
      queryTo: string;
      prompt: string;
    };

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
