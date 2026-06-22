# Claude Code: ApexMemory Router Index

Welcome to your local project workspace. This file is kept intentionally lightweight (under 100 lines) to avoid context rot and excessive token usage, while guiding Claude on how to access and update your deep, local WASM-vector database.

---

## 🧠 Memory Access & Injection Rules
All your structured instructions, developer preferences, active goals, and semantically matched past decisions live in:
- **Unified Snapshot (Always Read This):** [.claude/memory/memory.md](.claude/memory/memory.md)

### Detailed Sub-Modules:
If you need to inspect or update specific memory files directly, look inside the [.claude/memory/](.claude/memory/) directory:
- **Developer & OS Profile:** [.claude/memory/general.md](.claude/memory/general.md)
- **Active Today's Plan:** [.claude/memory/today.md](.claude/memory/today.md)
- **Verbatim Decisions Log:** [.claude/memory/decisions.md](.claude/memory/decisions.md)
- **Tool Customizations:** [.claude/memory/tools/](.claude/memory/tools/)

---

## 🛠️ Memory Commands (No Shortcuts)
You can run these scripts in your terminal to manage your vector memory database or query past sessions:

1. **Re-compile Snapshot:**
   ```bash
   .claude/memory/bin/memory.sh snapshot
   ```
   *Action:* Gathers active priorities and searches your vector store for the top 5 most relevant memories matching today's goals, then updates your snapshot index.

2. **Query Vector Memory:**
   ```bash
   .claude/memory/bin/memory.sh query "your search terms"
   ```
   *Action:* Computes a 384-dimensional WASM vector locally to find semantic matches from your past conversation logs.

3. **Insert Custom Fact:**
   ```bash
   .claude/memory/bin/memory.sh insert "New client project details..." "SourceFile" "Topic"
   ```
   *Action:* Vectorizes and registers a new durable fact in your database.

4. **Re-Mine Session Logs:**
   ```bash
   .claude/memory/bin/memory.sh mine
   ```
   *Action:* Scans your global Claude Code logs folder and vectorizes all historical prompts.

5. **Consolidate & De-conflict Memory:**
   ```bash
   .claude/memory/bin/memory.sh consolidate
   ```
   *Action:* Scans your active database, calculates semantic similarities, and automatically deprecates older conflicting guidelines using Temporal Dominance.

---

## 📌 Guiding Behaviors for Claude Code
- **Context Preservation:** Whenever a session starts, read [.claude/memory/memory.md](.claude/memory/memory.md) first to load the active context.
- **Dynamic Updates:** If the user gives a new rule or makes a key project decision, append it to [.claude/memory/decisions.md](.claude/memory/decisions.md) and execute `.claude/memory/bin/memory.sh snapshot` to compile it into the index instantly.
- **Clickable References:** Always use clickable markdown links (e.g. `[file.js](src/file.ts:12)`) when referencing code locations inside text.
