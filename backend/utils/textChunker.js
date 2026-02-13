/**
 * Splits a given text into chunks for better AI processing.
 * @param {string} text - The text to be chunked.
 * @param {number} chunkSize - The maximum size of each chunk.
 * @param {number} overlap - The number of overlapping characters between chunks.
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>} - An array of text chunks.,
 */

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // clean text while preserving paragrpaphs structure
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\s/g, "\n") // Replace all whitespace characters with new lines
    .replace(/\n /g, " ") // Remove spaces following new lines
    .replace(/ \n/g, " ") // Remove spaces preceding new lines
    .trim();

  // try to split by paragraphs(single or double new lines)
  const paragraphs = cleanedText.split(/\n+/).filter((p) => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  //1:1:24

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    //if single paragraph is larger than chunk size, split it into smaller parts
    if (paragraphWordCount > chunkSize) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });
      currentChunk = [];
      currentWordCount = 0;
    }

    //split larger paragraph into word based chunks
    for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
      const chunkWords = paragraphWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(" "),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      if (i + chunkSize >= paragraphWords.length) break; // if we have reached the end of the paragraph, break out of the loop
      // otherwise, continue to the next chunk
    }
    continue;
  }

  //if adding the current paragraph exceeds the chunk size, save the current chunk and start a new one
  if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex++,
      pageNumber: 0,
    });
    currentChunk = [];
    currentWordCount = 0;

    //create overlapping from previous chunk if needed
    const prevChunkText = currentChunk.join(" ");
    const prevWords = prevChunkText.trim().split(/\s+/);
    const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(" ");

    currentChunk = [overlapText, paragraph.trim()];
    currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
  } else {
    //add the paragraph to the current chunk
    currentChunk.push(paragraph.trim());
    currentWordCount += paragraphWordCount;
  }

  //add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex++,
      pageNumber: 0,
    });
  }

  //fallback if no chunks were created, split the text into word based chunks
  if (chunks.length === 0) {
    const words = cleanedText.split(/\s+/);
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(" "),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      if (i + chunkSize >= words.length) break; // if we have reached the end of the text, break out of the loop
    }
  }

  return chunks;
};
