const fs = require('fs');
const path = require('path');
const { loadDb, saveDb, dotProduct } = require('./vector-db');

const DB_PATH = path.join(__dirname, '../db/store.json');

async function consolidateDb() {
  console.log('=== Starting ApexMemory Vector Database Consolidation & De-confliction ===');

  const db = loadDb();
  if (!db.records || db.records.length === 0) {
    console.log('Database is empty. Nothing to consolidate.');
    return;
  }

  const activeRecords = db.records.filter(r => !r.metadata || r.metadata.superseded !== true);
  console.log(`Analyzing ${activeRecords.length} active vector memory chunks for conceptual conflicts...`);

  let conflictCount = 0;
  const conflictsToResolve = [];

  // Pairwise vector comparison (Cosine Similarity)
  for (let i = 0; i < activeRecords.length; i++) {
    for (let j = i + 1; j < activeRecords.length; j++) {
      const recA = activeRecords[i];
      const recB = activeRecords[j];

      const similarity = dotProduct(recA.vector, recB.vector);

      // Similarity threshold > 0.80 indicates high conceptual overlap (conflict or duplicate)
      if (similarity > 0.80) {
        conflictsToResolve.push({
          recA,
          recB,
          similarity: parseFloat(similarity.toFixed(4))
        });
      }
    }
  }

  console.log(`Discovered ${conflictsToResolve.length} semantic overlap groups.`);

  // Resolve conflicts using Temporal Dominance
  const resolvedIds = new Set();

  for (const conflict of conflictsToResolve) {
    const { recA, recB, similarity } = conflict;

    // Check if either has already been superseded in this run
    if (resolvedIds.has(recA.id) || resolvedIds.has(recB.id)) continue;

    const dateA = new Date(recA.metadata.timestamp);
    const dateB = new Date(recB.metadata.timestamp);

    let winner, loser;

    if (dateA >= dateB) {
      winner = recA;
      loser = recB;
    } else {
      winner = recB;
      loser = recA;
    }

    console.log(`\nConflict detected (Similarity: ${similarity}):`);
    console.log(`  [-] OLDER: "${loser.text.substring(0, 80)}..." (${loser.metadata.timestamp})`);
    console.log(`  [+] NEWER: "${winner.text.substring(0, 80)}..." (${winner.metadata.timestamp})`);
    console.log(`  -> Action: Superseded OLDER record with NEWER record.`);

    // Locate the loser in the database and mark it as superseded
    const dbRecord = db.records.find(r => r.id === loser.id);
    if (dbRecord) {
      dbRecord.metadata.superseded = true;
      dbRecord.metadata.superseded_by = winner.id;
      dbRecord.metadata.superseded_at = new Date().toISOString();
      resolvedIds.add(loser.id);
      conflictCount++;
    }
  }

  if (conflictCount > 0) {
    saveDb(db);
    console.log(`\n=== Consolidation Complete ===`);
    console.log(`Successfully resolved and de-conflicted ${conflictCount} outdated vector records.`);

    // Automate snapshot re-compilation after consolidation modifications
    try {
      const { compileMemorySnapshot } = require('./snapshot');
      compileMemorySnapshot().catch(() => {});
    } catch (err) {}
  } else {
    console.log('\n=== Consolidation Complete ===');
    console.log('No vector memory conflicts discovered. All systems clean and fully up to date.');
  }
}

if (require.main === module) {
  consolidateDb();
}

module.exports = { consolidateDb };
