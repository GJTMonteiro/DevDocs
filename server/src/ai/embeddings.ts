import 'dotenv/config';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = 'text-embedding-3-small';

export const generateEmbedding = async (
  text: string,
): Promise<number[]> => {
  const input = text.trim();

  if (!input) {
    throw new Error('Text is required to generate an embedding.');
  }

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input,
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding) {
    throw new Error('OpenAI did not return an embedding.');
  }

  return embedding;
};
