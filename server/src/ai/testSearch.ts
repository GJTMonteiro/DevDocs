import { searchSimilarChunks } from './searchSimilarChunks.js';

const results = await searchSimilarChunks(
  'How does authentication work?',
  3,
);

console.log(results);

process.exit(0);
