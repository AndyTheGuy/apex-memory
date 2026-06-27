const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME_DIR = os.homedir();
const GLOBAL_CLAUDE_DIR = path.join(HOME_DIR, '.claude');
const GLOBAL_MEMORY_DIR = path.join(GLOBAL_CLAUDE_DIR, 'memory');
const DB_PATH = path.join(GLOBAL_MEMORY_DIR, 'db/store.json');
const SNAPSHOT_PATH = path.join(GLOBAL_MEMORY_DIR, 'memory.md');

function renderVisualization() {
  console.log('================================================================');
  console.log('         🧠 ApexMemory: Real-Time Database Visualization 🧠      ');
  console.log('================================================================');

  let totalRecords = 0;
  let activeRecords = 0;
  let supersededRecords = 0;
  let dbSizeKb = 0;
  let hasDb = false;

  // 1. Gather Database Stats
  if (fs.existsSync(DB_PATH)) {
    try {
      hasDb = true;
      const stats = fs.statSync(DB_PATH);
      dbSizeKb = (stats.size / 1024).toFixed(2);

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      if (db.records) {
        totalRecords = db.records.length;
        activeRecords = db.records.filter(r => !r.metadata || r.metadata.superseded !== true).length;
        supersededRecords = totalRecords - activeRecords;
      }
    } catch (err) {
      console.warn('Warning: Could not parse database stats:', err.message);
    }
  }

  // 2. Render ASCII Memory Map
  console.log('\n[🧠 MASTER CONTEXT SNAPSHOT DATAFLOW]');
  console.log('                          ┌────────────────────────┐');
  console.log('                          │   Your Active Project  │');
  console.log('                          │     [ claude.md ]      │');
  console.log('                          └───────────┬────────────┘');
  console.log('                                      │');
  console.log('                                      ▼ (Read on demand)');
  console.log('  ┌──────────────────────────────────────────────────────────────┐');
  console.log('  │             ~/.claude/memory/ [ memory.md ]                  │');
  console.log('  │          - Active Profile (general.md)                       │');
  console.log('  │          - Active Decisions (decisions.md)                   │');
  console.log('  │          - Top 5 Semantic Vector Matches (store.json)        │');
  console.log('  └───────────────────────────▲──────────────────────────────────┘');
  console.log('                              │');
  console.log('                              ▼ (Search & Compile)');
  console.log('┌────────────────────────────────────────────────────────────────┐');
  console.log('│                 ~/.claude/memory/db/ [ store.json ]            │');
  console.log('│         - 384-Dim Local WASM Vectors (all-MiniLM-L6-v2 ONNX)   │');
  console.log('└────────────────────────────────────────────────────────────────┘');

  // 3. Render Statistical Overview
  console.log('\n[📊 DATABASE STATISTICS & METRICS]');
  console.log('────────────────────────────────────────────────────────────────');
  console.log(`- Database Status:      ${hasDb ? '🟢 ACTIVE & ONLINE' : '🔴 OFFLINE / INITIALIZING'}`);
  console.log(`- Master Storage Path:  ${DB_PATH}`);
  console.log(`- Database Size:        ${dbSizeKb} KB`);
  console.log(`- Total Indexed Chunks: ${totalRecords} records`);
  console.log(`- Active Memories:      ${activeRecords} records`);
  console.log(`- Superseded/Archived:  ${supersededRecords} records (de-conflicted)`);
  console.log('────────────────────────────────────────────────────────────────');

  // 4. Render Active Files Check
  console.log('\n[📁 CORE CONFIGURATION STATUS]');
  const checkFile = p => fs.existsSync(p) ? '🟢 OK' : '🔴 MISSING';
  console.log(`- Profile (general.md):   ${checkFile(path.join(GLOBAL_MEMORY_DIR, 'general.md'))}`);
  console.log(`- Today (today.md):       ${checkFile(path.join(GLOBAL_MEMORY_DIR, 'today.md'))}`);
  console.log(`- Decisions (decisions.md):${checkFile(path.join(GLOBAL_MEMORY_DIR, 'decisions.md'))}`);
  console.log(`- Snapshot (memory.md):   ${checkFile(SNAPSHOT_PATH)}`);
  console.log('================================================================\n');

  // Automatically trigger real-time browser dashboard launch on visualization
  try {
    const { launchDashboard } = require('./dashboard');
    launchDashboard();
  } catch (err) {
    // Fail silently if dashboard.js isn't found in the active path
  }
}

if (require.main === module) {
  renderVisualization();
}

module.exports = { renderVisualization };
