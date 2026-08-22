import { ilike, or } from 'drizzle-orm';

import { db } from '../../config/database.js';

import { documents } from '../../db/schema/documents.js';

export interface AskAIInput {
  message: string;
}

export interface AIChatSource {
  id: string;
  title: string;
  category: string | null;
}

export interface AIChatResponse {
  answer: string;
  sources: AIChatSource[];
}

interface MatchedDocument {
  id: string;
  title: string;
  content: string;
  category: string | null;
}

export const askAI = async (input: AskAIInput): Promise<AIChatResponse> => {
  const message = input.message.trim();

  if (!message) {
    throw new Error('Message is required.');
  }

  const searchTerms = message
    .split(/\s+/)
    .map((term) => term.replace(/[^\wÀ-ÿ-]/g, '').trim())
    .filter((term) => term.length >= 2)
    .slice(0, 8);

  if (searchTerms.length === 0) {
    return {
      answer: 'I could not identify a useful search term in your question.',
      sources: [],
    };
  }

  const conditions = searchTerms.flatMap((term) => [
    ilike(documents.title, `%${term}%`),
    ilike(documents.content, `%${term}%`),
    ilike(documents.category, `%${term}%`),
  ]);

  const matchedDocuments: MatchedDocument[] = await db
    .select({
      id: documents.id,
      title: documents.title,
      content: documents.content,
      category: documents.category,
    })
    .from(documents)
    .where(or(...conditions))
    .limit(5);

  if (matchedDocuments.length === 0) {
    return {
      answer:
        'I could not find relevant information in the current documentation.',
      sources: [],
    };
  }

  const primaryDocument = matchedDocuments[0];

  const content = primaryDocument.content.trim();

  const excerpt =
    content.length > 1000 ? `${content.slice(0, 1000)}...` : content;

  const sources: AIChatSource[] = matchedDocuments.map((document) => ({
    id: document.id,
    title: document.title,
    category: document.category,
  }));

  return {
    answer: [
      `Based on the current DevDocs documentation, the most relevant document is "${primaryDocument.title}".`,
      '',
      excerpt,
      '',
      'This answer is based on the documentation currently available in DevDocs.',
    ].join('\n'),
    sources,
  };
};
