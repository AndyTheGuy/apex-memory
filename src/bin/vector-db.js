const fs = require('fs');
const path = require('path');
const { computeEmbedding } = require('./embed');

const DB_PATH = path.join(__dirname, '../db/store.json');

// Ensure the db folder exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Load database
function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { records: [] };
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading vector database, starting fresh:', err);
    return { records: [] };
  }
}

// Save database
function saveDb(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving vector database:', err);
  }
}

// Standard Dot Product (since our vectors are already normalized by the WASM pipeline)
function dotProduct(vecA, vecB) {
  let product = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

// Simple Jaccard Token-Based Similarity for Keyword Matching
function keywordSimilarity(textA, textB) {
  const normalize = t => t.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  const setA = new Set(normalize(textA));
  const setB = new Set(normalize(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const term of setA) {
    if (setB.has(term)) intersection++;
  }
  return intersection / (setA.size + setB.size - intersection);
}

// Insert a text chunk with metadata
async function insertRecord({ text, metadata = {} }) {
  const db = loadDb();

  // Clean text and verify
  const cleanText = text.trim();
  if (!cleanText) return null;

  // Prevent duplicates of exact text in the same file/source context
  const isDup = db.records.some(r => r.text === cleanText && r.metadata.source === metadata.source);
  if (isDup) return null;

  // Compute local dense embedding
  const vector = await computeEmbedding(cleanText);

  const record = {
    id: 'rec_' + Math.random().toString(36).substr(2, 9),
    text: cleanText,
    vector,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata
    }
  };

  db.records.push(record);
  saveDb(db);

  // Automate snapshot re-compilation on record insertion (lazy require prevents circular dependency)
  try {
    const { compileMemorySnapshot } = require('./snapshot');
    compileMemorySnapshot().catch(() => {});
  } catch (err) {}

  return record;
}

// Semantic and Hybrid Search
async function queryDb(queryText, limit = 5, filters = {}, minScore = 0.0) {
  const db = loadDb();
  if (db.records.length === 0) return [];

  // Compute query vector
  const queryVector = await computeEmbedding(queryText);

  // Score each record
  const scored = db.records
    .filter(record => {
      // Ignore records that have been superseded/deprecated by newer decisions
      if (record.metadata && record.metadata.superseded === true) return false;

      // Apply metadata filters if provided
      for (const [key, val] of Object.entries(filters)) {
        if (record.metadata[key] !== val) return false;
      }
      return true;
    })
    .map(record => {
      // 1. Compute Semantic Score (Cosine Similarity via dot product)
      const semanticScore = dotProduct(queryVector, record.vector);

      // 2. Compute Keyword Score
      const keyScore = keywordSimilarity(queryText, record.text);

      // 3. Hybrid Reranking (70% Semantic, 30% Exact Token Match)
      const hybridScore = (0.7 * semanticScore) + (0.3 * keyScore);

      return {
        id: record.id,
        text: record.text,
        metadata: record.metadata,
        score: parseFloat(hybridScore.toFixed(4)),
        semanticScore: parseFloat(semanticScore.toFixed(4)),
        keywordScore: parseFloat(keyScore.toFixed(4))
      };
    })
    // Filter by minimum hybrid score threshold
    .filter(res => res.score >= minScore);

  // Sort by highest hybrid score first
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const action = args[0];

  if (action === 'insert') {
    const text = args[1];
    const source = args[2] || 'CLI';
    const topic = args[3] || 'general';
    if (!text) {
      console.error('Usage: node vector-db.js insert "<text>" [source] [topic]');
      process.exit(1);
    }
    insertRecord({ text, metadata: { source, topic } }).then(rec => {
      console.log('Record Inserted Successfully:', JSON.stringify(rec, null, 2));
    });
  } else if (action === 'query') {
    const query = args[1];
    if (!query) {
      console.error('Usage: node vector-db.js query "<query_text>"');
      process.exit(1);
    }
    queryDb(query).then(results => {
      console.log('Query Results:\n', JSON.stringify(results, null, 2));
    });
  } else {
    console.log('Usage:\n  node vector-db.js insert "<text>" [source] [topic]\n  node vector-db.js query "<query>"');
  }
}

module.exports = { insertRecord, queryDb, loadDb, saveDb, dotProduct };
