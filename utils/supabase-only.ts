import { createClient } from "@supabase/supabase-js";

import type { Database } from "types_db";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const apiKey = process.env.OPENAI_API_KEY;

export const searchEmbeddings = async ({
  query,
  limit = 5,
  queryTo
}: {
  query: string;
  limit?: number;
  queryTo: string;
}) => {
  const input = query.replace(/\n/g, " ");

  const embeddingsJson = await fetch("https://api.openai.com/v1/embeddings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input
    })
  });

  const json = await embeddingsJson.json();
  const embedding = json.data[0].embedding;

  const { data, error } = await supabaseAdmin.rpc("embeddings_search", {
    query_embedding: embedding,
    similarity_threshold: 0.01,
    match_count: limit,
    query_to: queryTo
  });

  return { data, error };
};

export const createQueryRecord = async ({ from, to, message }: { from: string; to: string; message: string }) => {
  const queryData = {
    from_id: from,
    to_id: to,
    message_text: message
  };
  const { error, data } = await supabaseAdmin.from("queries").insert(queryData).select();
  if (error) throw error;
  const [{ id }] = data;
  console.log(`Query inserted: ${id}`);
};
