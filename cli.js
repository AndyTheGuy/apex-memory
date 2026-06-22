#!/usr/bin/env node

const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME_DIR = os.homedir();
const GLOBAL_MEMORY_DIR = path.join(HOME_DIR, '.claude/memory');

const args = process.argv.slice(2);
const action = args[0];

if (!action) {
  console.log('=== ApexMemory: Developer CLI Proxy ===');
  console.log('Commands:');
  console.log('  node cli.js snapshot                      - Recompile active context index (memory.md)');
  console.log('  node cli.js mine                          - Parse past Claude Code session logs recursively');
  console.log('  node cli.js query "<search_query>"        - Run local semantic and hybrid vector queries');
  console.log('  node cli.js consolidate                   - De-conflict duplicates using Temporal Dominance');
  console.log('  node cli.js insert "<text>" [src] [topic] - Insert a custom memory record');
  process.exit(0);
}

// Map the CLI actions directly to the central home configuration scripts
const scriptMappings = {
  snapshot: 'bin/snapshot.js',
  mine: 'bin/mine.js',
  consolidate: 'bin/consolidate.js',
  query: 'bin/vector-db.js',
  insert: 'bin/vector-db.js'
};

const targetScript = scriptMappings[action];
if (!targetScript) {
  console.error(`Error: Unknown action "${action}".`);
  process.exit(1);
}

const absoluteScriptPath = path.join(GLOBAL_MEMORY_DIR, targetScript);

// Forward the arguments to the target home configuration script
try {
  let command = `node "${absoluteScriptPath}"`;
  if (action === 'query') {
    if (!args[1]) {
      console.error('Error: Missing search string.');
      console.log('Usage: node cli.js query "<search_term>"');
      process.exit(1);
    }
    command += ` query "${args[1]}"`;
  } else if (action === 'insert') {
    if (!args[1]) {
      console.error('Error: Missing text to insert.');
      console.log('Usage: node cli.js insert "<text>" [source] [topic]');
      process.exit(1);
    }
    command += ` insert "${args[1]}" "${args[2] || 'CLI'}" "${args[3] || 'general'}"`;
  } else if (args.length > 1) {
    command += ` ${args.slice(1).map(a => `"${a}"`).join(' ')}`;
  }

  // Execute from the central home configuration folder
  execSync(command, { stdio: 'inherit', cwd: GLOBAL_MEMORY_DIR });
} catch (err) {
  // Errors are handled natively by child processes
  process.exit(1);
}
