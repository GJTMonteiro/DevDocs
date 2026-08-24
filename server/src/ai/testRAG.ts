import { answerWithRAG } from './rag.js';

const result = await answerWithRAG(
  'How does authentication work in DevDocs?',
);

console.log('\nANSWER:\n');
console.log(result.answer);

console.log('\nSOURCES:\n');
console.log(result.sources);

process.exit(0);
