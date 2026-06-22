---
name: apex-query
description: Query your global vector memory database semantically for past decisions, rules, and facts.
---

# ApexMemory Semantic Search & Query

This skill queries your centralized local vector database using a 384-dimensional dense semantic pipeline, finding matches based on conceptual meaning rather than exact keyword matches.

## When to Use This Skill

- When you are looking for past decisions, guidelines, or configurations but can't remember the exact files or words.
- When you want to retrieve matching guidelines from past projects.

## How It Works

It executes:
`node C:/Users/beste/.claude/memory/bin/vector-db.js query "<your_query_text>"`

Simply invoke:
`/apex-query "<your search terms>"`
