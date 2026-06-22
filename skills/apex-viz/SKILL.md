---
name: apex-viz
description: Output a real-time ASCII visualization and statistical overview of your global memory database.
---

# ApexMemory Real-Time Database Visualization

This skill queries your local persistent database store, calculates real-time metrics (active chunks, superseded records, database file size), and renders a beautiful ASCII mind-map showing exactly how your files and snapshots link together.

## When to Use This Skill

- When you want to verify the active status of your global database.
- When you want to see exactly how many memories have been saved or de-duplicated.
- When you want a visual overview of where your memory files and snapshots live on Windows 11.

## How It Works

It executes:
`node C:/Users/beste/.claude/memory/bin/viz.js`

Simply invoke:
`/apex-viz`
