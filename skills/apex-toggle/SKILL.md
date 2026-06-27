---
name: apex-toggle
description: Dynamically toggle the ApexMemory system ON or OFF globally or for the active project.
---

# ApexMemory Universal On/Off Toggle

This skill allows you to instantly enable or disable the memory system, stopping all semantic snapshot compilations and context injections to give you a completely raw or active session.

## When to Use This Skill

- When you want to temporarily disable memory context injections to save startup tokens.
- When you are working on a highly experimental branch where you do not want past decisions retrieved.
- When you are ready to re-enable your local WASM-vector snapshot compilations.

## How It Works

It routes directly to your local configuration CLI and toggles a `.claude/disabled` bypass file:
- `/apex-toggle disable`          - Disable for the current project folder.
- `/apex-toggle enable`           - Re-enable for the current project folder.
- `/apex-toggle disable-global`   - Disable globally across all projects.
- `/apex-toggle enable-global`    - Re-enable globally across all projects.
