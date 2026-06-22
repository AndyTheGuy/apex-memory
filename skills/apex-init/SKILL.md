---
name: apex-init
description: Automatically links this folder to the global ApexMemory brain, mines past session history, and compiles your snapshot.
---

# ApexMemory Project Linker & Initializer

This skill links your active project directory directly to your global memory brain, establishing directory junctions and compiling a fresh context snapshot.

## When to Use This Skill

- When entering a new project directory for the first time.
- When resuming work on an older project directory that hasn't been initialized with ApexMemory.
- When you want to ensure all past session history for this directory is fully mined, indexed, and compiled.

## How It Works

This skill automatically executes:
1. `node C:/Users/beste/.claude/memory/bin/global-init.js` (Establishes junctions, writes `claude.md`).
2. `node C:/Users/beste/.claude/memory/bin/mine.js` (Mines past sessions).
3. `node C:/Users/beste/.claude/memory/bin/consolidate.js` (De-conflicts and compiles snapshot).

Simply invoke `/apex-init` to execute the full setup natively.
