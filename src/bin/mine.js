const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { insertRecord } = require('./vector-db');

const PROJECTS_DIR = path.join(require('os').homedir(), '.claude/projects');

// Helper to escape Windows and unescaped paths back to a clean name
function getProjectName(filePath) {
  const baseName = path.basename(filePath, '.jsonl');
  // Clean separators
  return baseName
    .replace(/^c--Users-beste-Documents-/, '')
    .replace(/^C--Users-beste-Documents-/, '')
    .replace(/^c--Users-beste-/, '')
    .replace(/^C--Users-beste-/, '')
    .replace(/-/g, '/');
}

// sliding-window text chunker to prevent large file imports from bloating vector queries
function chunkText(text, maxChars = 1000, overlap = 200) {
  if (text.length <= maxChars) {
    return [text];
  }
  const chunks = [];
  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = startIndex + maxChars;
    if (endIndex > text.length) {
      endIndex = text.length;
    }
    chunks.push(text.substring(startIndex, endIndex));
    startIndex += (maxChars - overlap);
  }
  return chunks;
}

async function mineSessionFile(filePath) {
  const projectName = getProjectName(filePath);
  console.log(`Mining Session: [${projectName}] from ${path.basename(filePath)}...`);

  if (!fs.existsSync(filePath)) return 0;

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const conversationTurns = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      // We target user prompts and assistant replies
      if (obj.type === 'user' && obj.message && obj.message.content) {
        const textBlocks = obj.message.content
          .filter(c => c.type === 'text')
          .map(c => c.text)
          .join('\n');

        // Strip out noisy tags like <ide_opened_file> or <system-reminder> to keep memory clean
        const cleanedText = textBlocks
          .replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g, '')
          .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
          .trim();

        if (cleanedText) {
          conversationTurns.push({
            role: 'user',
            text: cleanedText,
            timestamp: obj.timestamp || new Date().toISOString()
          });
        }
      }
      // Note: Claude Code logs assistant content sometimes in 'assistant' type or tool results.
      // We focus primarily on indexing the user's questions and substantive tasks as context anchors.
    } catch (err) {
      // Skip malformed lines gracefully
    }
  }

  // Group user prompts into semantic chunks of Q&A anchors
  let minedCount = 0;
  for (let i = 0; i < conversationTurns.length; i++) {
    const turn = conversationTurns[i];

    // Chunk size guidelines: we index each unique user prompt as a search anchor
    // If it's too short (e.g. "yes", "ok", "no"), skip it as it adds noise.
    if (turn.text.length < 15) continue;

    // Apply token-aware sliding window chunking to protect the context window
    const chunks = chunkText(turn.text);

    for (let j = 0; j < chunks.length; j++) {
      const chunkTextContent = chunks[j];

      // Build rich metadata for citation
      const metadata = {
        source: `Session History: ${projectName}`,
        project: projectName,
        original_date: turn.timestamp,
        type: 'historical-session',
        chunk_index: j + 1,
        total_chunks: chunks.length
      };

      const inserted = await insertRecord({
        text: chunkTextContent,
        metadata
      });

      if (inserted) {
        minedCount++;
      }
    }
  }

  return minedCount;
}

// Crawl and mine all projects
async function runMiner() {
  console.log('=== Starting Claude Code Back-Catalog History Miner ===');

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`Projects directory not found at: ${PROJECTS_DIR}`);
    return;
  }

  // Find all JSONL session logs recursively using standard Node recursive readdir API
  const files = fs.readdirSync(PROJECTS_DIR, { recursive: true })
    .filter(file => file.endsWith('.jsonl'))
    .map(file => path.join(PROJECTS_DIR, file));
  console.log(`Found ${files.length} past session log files to digest.`);

  let totalMined = 0;
  for (const file of files) {
    try {
      const count = await mineSessionFile(file);
      totalMined += count;
    } catch (err) {
      console.error(`Error mining file ${file}:`, err);
    }
  }

  console.log(`\n=== Mining Complete! ===`);
  console.log(`Successfully indexed ${totalMined} past conversation contexts as semantic vector memories.`);
}

if (require.main === module) {
  runMiner();
}

module.exports = { runMiner };
