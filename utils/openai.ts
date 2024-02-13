import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser"
import { Configuration, OpenAIApi } from "openai"

import { OpenAIMessage } from "~/types"

export enum OpenAIModel {
  GTP = "gpt-4"
}

const apiKey = process.env.OPENAI_API_KEY

export const OpenAIStream = async (data: {
  prompt: OpenAIMessage[]
  messages: OpenAIMessage[]
  query: string
  relatedContent?: string
}) => {
  const { prompt, messages } = data
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.GTP,
      messages: [
        ...prompt,
        ...messages,
        data.relatedContent
          ? {
              role: "system",
              content: data.relatedContent
            }
          : undefined,
        { role: "user", content: data.query }
      ],
      max_tokens: 300,
      temperature: 0.0,
      stream: true
    })
  })

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error")
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data

          if (data === "[DONE]") {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    }
  })

  return stream
}

export const createEmbedding = async ({ content }: { content: string }) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
  const openai = new OpenAIApi(configuration)

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: content
  })

  const [{ embedding }] = embeddingResponse.data.data

  return embedding
}
