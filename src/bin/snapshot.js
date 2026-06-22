const fs = require('fs');
const path = require('path');
const { queryDb } = require('./vector-db');

const WORKSPACE_DIR = path.join(__dirname, '../../..');
const GENERAL_PATH = path.join(__dirname, '../general.md');
const DECISIONS_PATH = path.join(__dirname, '../decisions.md');
const TODAY_PATH = path.join(__dirname, '../today.md');
const OUTPUT_INDEX_PATH = path.join(__dirname, '../memory.md');

// Generate default template files if they don't exist
function ensureTemplateFiles() {
  if (!fs.existsSync(GENERAL_PATH)) {
    fs.writeFileSync(GENERAL_PATH, `# Developer Profile & Environment Rules

## Environment Context
- **OS**: Windows 11 Home (win32, Git Bash POSIX syntax preferred in shell)
- **Primary Workspace**: \`c:/Users/beste/Documents/claude_code/claude-custom-improvements\`
- **Invoked Date**: 2026-06-22

## Preferences & Formatting
- **Coding Style**: Clean, modern CommonJS/ESM Node.js code, appropriate comment density.
- **Reference Code**: Always use clickable markdown link format (e.g., \`[file.ts](src/file.ts)\` or \`[file.ts:42](src/file.ts#L42)\`) when referencing file locations inside text. DO NOT use backticks for file locations unless requested.
- **Behavior**: Be highly detailed, factual, and direct. Verify changes before shipping.
`, 'utf8');
  }

  if (!fs.existsSync(DECISIONS_PATH)) {
    fs.writeFileSync(DECISIONS_PATH, `# Log of Key Decisions

## Active Project Commitments
- **2026-06-22**: Initialized ApexMemory local semantic vector database to upgrade context retention.
- **2026-06-22**: Integrated HuggingFace transformers offline pipeline for native Windows vector support.
`, 'utf8');
  }

  if (!fs.existsSync(TODAY_PATH)) {
    fs.writeFileSync(TODAY_PATH, `# Active Shipping Plan (Today)

## High Priorities
- Configure elite memory setup for Claude Code.
- Run the Back-Catalog Miner to ingest all historical session data.
- Consolidate memory indexing folders for the local workspace.
`, 'utf8');
  }
}

async function compileMemorySnapshot() {
  ensureTemplateFiles();

  console.log('Compiling dynamic memory snapshot...');

  const generalContent = fs.readFileSync(GENERAL_PATH, 'utf8').trim();
  const decisionsContent = fs.readFileSync(DECISIONS_PATH, 'utf8').trim();
  const todayContent = fs.readFileSync(TODAY_PATH, 'utf8').trim();

  // Query Vector DB for highly relevant memories matching "today's active goals" (with a 0.28 score threshold to cut out noise)
  let semanticSnippets = '';
  try {
    const todayGoals = todayContent.replace(/#.*$/gm, '').trim(); // Strip headers
    const results = await queryDb(todayGoals, 5, {}, 0.28);

    if (results && results.length > 0) {
      semanticSnippets = results
        .map((res, index) => {
          return `### Memory #${index + 1}: ${res.metadata.source || 'General'} (Score: ${res.score})
*Date: ${res.metadata.original_date || res.metadata.timestamp || 'N/A'}*
\`\`\`markdown
${res.text}
\`\`\`
`;
        })
        .join('\n');
    } else {
      semanticSnippets = '*No relevant historical semantic memories found in local DB yet. Run the catalog miner to populate.*';
    }
  } catch (err) {
    console.warn('Could not load vector queries for snapshot:', err.message);
    semanticSnippets = '*Semantic vector engine initializing...*';
  }

  // Compile unified index markdown (The "Frozen Snapshot" representation)
  const compiledMarkdown = `# 🧠 ApexMemory: Frozen Context Snapshot

This file is automatically compiled. It merges static developer guidelines, active project priorities, and semantic history matches to fight context rot.

---

## 1. Static Developer Guidelines
${generalContent.replace(/#.*$/, '') /* Strip top header */}

---

## 2. Active Decisions & Priorities
${decisionsContent.replace(/#.*$/, '')}

---

## 3. Shipping Targets (Today)
${todayContent.replace(/#.*$/, '')}

---

## 4. Semantically Retrieved Past Decisions (WASM vector-matched)
${semanticSnippets}

---
*Last Consolidated: ${new Date().toISOString()}*
`;

  fs.writeFileSync(OUTPUT_INDEX_PATH, compiledMarkdown, 'utf8');
  console.log(`Successfully compiled unified context index to: ${OUTPUT_INDEX_PATH}`);
}

if (require.main === module) {
  compileMemorySnapshot();
}

module.exports = { compileMemorySnapshot };
