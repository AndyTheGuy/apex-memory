const path = require('path');

// Dynamically import @huggingface/transformers as it is an ES module
async function getPipeline() {
  const { pipeline } = await import('@huggingface/transformers');
  // Initialize the feature-extraction pipeline with the lightweight all-MiniLM-L6-v2 model (approx 80MB WASM model)
  // It runs 100% locally and caches the model file inside the local directory
  return pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

async function computeEmbedding(text) {
  try {
    const extractor = await getPipeline();
    // Compute embeddings with pooling and normalization
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // Convert Float32Array to standard JS Array
    const embedding = Array.from(output.data);
    return embedding;
  } catch (error) {
    console.error('Error computing local embedding:', error);
    process.exit(1);
  }
}

// Enable direct execution from the command line
if (require.main === module) {
  const text = process.argv.slice(2).join(' ');
  if (!text) {
    console.error('Usage: node embed.js "<text>"');
    process.exit(1);
  }
  computeEmbedding(text).then(embedding => {
    console.log(JSON.stringify(embedding));
  });
}

module.exports = { computeEmbedding };
