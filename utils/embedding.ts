import { encode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";

import { Chunk, Content } from "~/types";

const CHUNK_SIZE = 200;

const chunkContent = (data: Content) => {
  const { content, url, date, mentions, ...rest } = data;

  let chunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const strings = content.split(/\r?\n+/); // 暂时只处理换行符
    let chunkText = "";

    strings.forEach((sentence) => {
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
        chunks.push(chunkText);
        chunkText = "";
      }

      chunkText += sentence + "\n";
    });

    chunks.push(chunkText.trim());
  } else {
    chunks.push(content.trim());
  }

  console.log("chunks", chunks);

  const contentChunks = chunks
    .filter((text) => text.trim().length > 0)
    .map((text) => {
      const trimmedText = text.trim();

      const chunk: Chunk = {
        content: trimmedText,
        content_length: trimmedText.length,
        content_tokens: encode(trimmedText).length,
        embedding: [],
        original_url: url,
        original_date: date
      };

      return chunk;
    });

  if (contentChunks.length > 1) {
    for (let i = 0; i < contentChunks.length; i++) {
      const chunk = contentChunks[i];
      const prevChunk = contentChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        contentChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: Content = {
    ...data,
    chunks: contentChunks
  };

  return chunkedSection;
};

export const generateEmbeddings = async (content: Content) => {
  const { chunks, ...rest } = chunkContent(content);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  const embeddingInsertInputs = await Promise.all(
    chunks.map(async (chunk) => {
      const embeddingRes = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: chunk.content
      });

      const [{ embedding }] = embeddingRes.data.data;

      const embeddingInsertInput = {
        content: chunk.content,
        content_length: chunk.content_length,
        content_tokens: chunk.content_tokens,
        essay_url: content.url,
        essay_date: content.date,
        essay_title: content.title,
        essay_thanks: content.mentions,

        embedding,
        avatar_id: content.avatar_id
      };

      return embeddingInsertInput;
    })
  );

  return embeddingInsertInputs;
};

/**
 *
 * - 自动 id uuid primary key NOT NULL DEFAULT uuid_generate_v4(),
  - 统一 avatar_id text,
  - 统一 essay_title text,
  - 统一 essay_url text,
  - 统一 essay_date text,
  - 统一 essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
 */
