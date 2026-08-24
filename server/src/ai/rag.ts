import OpenAI from 'openai';

import { searchSimilarChunks } from './searchSimilarChunks.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHAT_MODEL = 'gpt-5-mini';

export interface RAGResponse {
  answer: string;
  sources: {
    id: string;
    title: string;
    category: string | null;
    similarity: number;
  }[];
}

interface DocumentContext {
  documentId: string;
  title: string;
  category: string | null;
  similarity: number;
  chunks: {
    chunkId: string;
    content: string;
  }[];
}

export const answerWithRAG = async (question: string): Promise<RAGResponse> => {
  const message = question.trim();

  if (!message) {
    throw new Error('Question is required.');
  }

  /*
   * =========================================
   * RETRIEVE RELEVANT DOCUMENTATION
   * =========================================
   */

  const chunks = await searchSimilarChunks(message, 5);

  if (chunks.length === 0) {
    return {
      answer:
        'I could not find relevant information in the current documentation.',
      sources: [],
    };
  }

  /*
   * =========================================
   * GROUP CHUNKS BY DOCUMENT
   * =========================================
   */

  const documentsMap = new Map<string, DocumentContext>();

  for (const chunk of chunks) {
    const existing = documentsMap.get(chunk.documentId);

    if (existing) {
      existing.chunks.push({
        chunkId: chunk.chunkId,
        content: chunk.content,
      });

      if (chunk.similarity > existing.similarity) {
        existing.similarity = chunk.similarity;
      }

      continue;
    }

    documentsMap.set(chunk.documentId, {
      documentId: chunk.documentId,
      title: chunk.title,
      category: chunk.category,
      similarity: chunk.similarity,
      chunks: [
        {
          chunkId: chunk.chunkId,
          content: chunk.content,
        },
      ],
    });
  }

  /*
   * =========================================
   * BUILD DOCUMENTATION CONTEXT
   * =========================================
   */

  const context = Array.from(documentsMap.values())
    .map((document) => {
      const chunksContext = document.chunks
        .map((chunk, chunkIndex) =>
          [`[Relevant section ${chunkIndex + 1}]`, chunk.content.trim()].join(
            '\n',
          ),
        )
        .join('\n\n');

      return [
        '---',
        `Title: ${document.title}`,
        `Category: ${document.category ?? 'Uncategorized'}`,
        '',
        'Relevant documentation:',
        chunksContext,
        '---',
      ].join('\n');
    })
    .join('\n\n');

  /*
   * =========================================
   * GENERATE ANSWER
   * =========================================
   */

  const response = await openai.responses.create({
    model: CHAT_MODEL,
    instructions: `
You are DevDocs AI, an assistant for internal technical documentation.

Your task is to answer the user's question using ONLY the documentation provided below.

STRICT RULES:

1. Use only information explicitly contained in the provided documentation.

2. Never invent or assume technical details.

3. Never invent:
   - API endpoints
   - HTTP methods
   - request parameters
   - response fields
   - authentication flows
   - headers
   - configuration values
   - code examples
   - commands
   - database details
   - architecture details

4. If the documentation provides an exact technical detail, preserve it accurately.

5. If the documentation provides a code example, HTTP request, command, configuration or header format, preserve the relevant structure when answering.

6. You may combine information from multiple documents when necessary to answer the question.

7. If the documentation does not contain enough information to answer the question completely, say clearly what information is missing.

8. Do not fill missing information using general programming knowledge.

9. Do not claim that something is documented if it is not present in the provided context.

10. Do not mention the retrieval process, embeddings, chunks, vector search, RAG or internal implementation.

11. Do not refer to documents as "Documentation 1", "Documentation 2", etc.

12. Keep answers concise, clear and technically accurate.

13. When useful, structure the answer using short headings, bullet points or code blocks.

14. If the user asks a question unrelated to the provided documentation, explain that the available documentation does not contain enough information to answer it.

15. Accuracy is more important than completeness. Never guess.

16. If the documentation contains conflicting information, do not choose one version yourself. Clearly explain that the documentation contains conflicting information.

17. Do not treat a document title or category as evidence for information that is not present in its content.

18. Do not infer missing technical details from examples unless the documentation explicitly supports that inference.

19. When answering a question about an exact technical value, only provide the value if it appears explicitly in the provided documentation.

20. If only part of the requested information is documented, provide that part and clearly identify what remains undocumented.

DOCUMENTATION CONTEXT:

${context}
`,
    input: message,
  });

  /*
   * =========================================
   * VALIDATE AI RESPONSE
   * =========================================
   */

  const answer = response.output_text.trim();

  if (!answer) {
    throw new Error('AI did not return an answer.');
  }

  /*
   * =========================================
   * RETURN UNIQUE DOCUMENT SOURCES
   * =========================================
   */

  const sources = Array.from(documentsMap.values())
    .sort((a, b) => b.similarity - a.similarity)
    .map((document) => ({
      id: document.documentId,
      title: document.title,
      category: document.category,
      similarity: document.similarity,
    }));

  return {
    answer,
    sources,
  };
};
