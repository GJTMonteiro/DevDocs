import { answerWithRAG } from '../../ai/rag.js';

export interface AskAIInput {
  message: string;
}

export interface AIChatSource {
  id: string;
  title: string;
  category: string | null;
  similarity: number;
}

export interface AIChatResponse {
  answer: string;
  sources: AIChatSource[];
}

export const askAI = async (input: AskAIInput): Promise<AIChatResponse> => {
  const message = input.message.trim();

  if (!message) {
    throw new Error('Message is required.');
  }

  const result = await answerWithRAG(message);

  /*
   * A document can contain multiple chunks.
   *
   * We only want to expose each document once,
   * keeping the highest similarity score found
   * among its chunks.
   */
  const sourcesMap = new Map<string, AIChatSource>();

  for (const source of result.sources) {
    const existingSource = sourcesMap.get(source.id);

    if (!existingSource || source.similarity > existingSource.similarity) {
      sourcesMap.set(source.id, {
        id: source.id,
        title: source.title,
        category: source.category,
        similarity: source.similarity,
      });
    }
  }

  /*
   * Return sources ordered by relevance.
   */
  const uniqueSources = Array.from(sourcesMap.values()).sort(
    (a, b) => b.similarity - a.similarity,
  );

  return {
    answer: result.answer,
    sources: uniqueSources,
  };
};
