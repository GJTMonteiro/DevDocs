import { generateEmbedding } from './embeddings.js';

const embedding = await generateEmbedding(
  'DevDocs uses JWT authentication for protecting API routes.',
);

console.log('Embedding dimensions:', embedding.length);
console.log('First values:', embedding.slice(0, 5));

process.exit(0);
