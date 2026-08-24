import { indexDocument } from './indexDocument.js';

const documentId =
  '14f262de-8e3b-4a38-96b3-e5959bfbf1c4';

const result = await indexDocument(documentId);

console.log('Chunks:', result.chunks.length);
console.log('Embeddings:', result.embeddings.length);

console.log(
  result.embeddings.map((embedding) => ({
    id: embedding.id,
    chunkId: embedding.chunkId,
    content: embedding.content,
  })),
);

process.exit(0);
