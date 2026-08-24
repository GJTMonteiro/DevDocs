export interface DocumentChunk {
  content: string;
  chunkIndex: number;
}

const DEFAULT_CHUNK_SIZE = 500;
const DEFAULT_CHUNK_OVERLAP = 100;

export const splitIntoChunks = (
  text: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP,
): DocumentChunk[] => {
  const normalizedText = text.replace(/\s+/g, ' ').trim();

  if (!normalizedText) {
    return [];
  }

  if (overlap >= chunkSize) {
    throw new Error('Chunk overlap must be smaller than chunk size.');
  }

  const words = normalizedText.split(' ');
  const chunks: DocumentChunk[] = [];

  let startWord = 0;
  let chunkIndex = 0;

  while (startWord < words.length) {
    let currentLength = 0;
    let endWord = startWord;

    while (endWord < words.length) {
      const wordLength = words[endWord].length;
      const separatorLength = endWord === startWord ? 0 : 1;

      if (currentLength + wordLength + separatorLength > chunkSize) {
        break;
      }

      currentLength += wordLength + separatorLength;

      endWord += 1;
    }

    if (endWord === startWord) {
      endWord += 1;
    }

    const content = words.slice(startWord, endWord).join(' ').trim();

    if (content) {
      chunks.push({
        content,
        chunkIndex,
      });

      chunkIndex += 1;
    }

    if (endWord >= words.length) {
      break;
    }

    /*
     * Calculate overlap using complete words
     * instead of cutting through characters.
     */
    let overlapLength = 0;
    let overlapWords = 0;

    for (let index = endWord - 1; index >= startWord; index -= 1) {
      const wordLength = words[index].length;

      const separatorLength = overlapWords === 0 ? 0 : 1;

      if (overlapLength + wordLength + separatorLength > overlap) {
        break;
      }

      overlapLength += wordLength + separatorLength;

      overlapWords += 1;
    }

    startWord = Math.max(endWord - overlapWords, startWord + 1);
  }

  return chunks;
};
