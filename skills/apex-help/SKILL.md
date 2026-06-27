---
name: apex-help
description: Display a comprehensive local handbook, command matrix, and best practices for the ApexMemory system.
---

# 🧠 ApexMemory Handbook & Command Reference

Welcome to the **ApexMemory** native help reference. This command displays everything you need to know about driving, maintaining, and getting the maximum performance out of your local semantic brain.

---

## 🛠️ The Command Matrix

You can run these commands natively inside any active Claude Code conversation. They correspond to local CLI shell scripts:

| Terminal Slash Command | Script Equivalent | Action / What it does | When to Run |
| :--- | :--- | :--- | :--- |
| **`/apex-init`** | `node global-init.js` | Links current directory to your global brain, parses past sessions, and compiles snapshot. | When starting or resuming an older project directory. |
| **`/apex-query "<query>"`** | `node vector-db.js query` | Executes 384-dimension local WASM-vector semantic search. | To find past technical decisions, rules, or configurations by *meaning*. |
| **`/apex-viz`** | `node viz.js` | Renders a console ASCII mapping, directory status, and database stats. | To verify active files and de-duplication counts. |
| **`/apex-toggle disable`** | `node cli.js disable` | Disables memory snapshot compilation for the active project folder. | To bypass context injections for experimental branches. |
| **`/apex-toggle enable`** | `node cli.js enable` | Re-enables snapshot compilation for the active project folder. | To restore context snaps for an active project. |
| **`/apex-toggle disable-global`**| `node cli.js disable-global`| Disables memory system globally for *all* projects on your machine. | To completely mute memory and save startup tokens globally. |
| **`/apex-toggle enable-global`** | `node cli.js enable-global` | Re-enables global snapshot compilation. | To restore global memory systems. |
| **`/apex-help`** | *Local Handbook* | Displays this help card. | Whenever you need usage guidelines or system maps. |

---

## 📂 The Directory Roadmap

ApexMemory splits your data cleanly into local workspace configs and a single global home directory brain to keep your project folders 100% clean and portable:

```
~/.claude/                       # Global Claude Code Folder
├── claude.md                    # Hidden parent system router (folder-climbing template)
└── memory/                      # Centralized Global Memory Brain
    ├── general.md               # Your permanent Developer Profile & OS context
    ├── decisions.md             # Verbatim log of key project/client decisions with dates
    ├── today.md                 # Daily active tasks profile (The "Focus Lens")
    ├── memory.md                # The compiled dynamic "Frozen Snapshot"
    └── db/
        └── store.json           # Your offline hybrid vector database (100% private)

C:/Users/beste/Desktop/your-project/
└── .claude/
    └── memory ───► Symbolic link (directory junction) back to ~/.claude/memory/
```

---

## 🏆 Pro Developer Best Practices

Follow these simple developer habits to squeeze the absolute highest performance out of your local AI brain:

### 1. Focus Your "Lens" Daily (20-Second morning habit)
Open `~/.claude/memory/today.md` and write 3-4 bullet points of what you are working on today. Our snapshot compiler uses these targets as a **semantic vector query** against your database. By updating `today.md`, you guarantee Claude is fed memories perfectly relevant to your daily tasks.

### 2. Ingest New Specs with "Grill Me" Sessions
Whenever you start a major new feature, tell Claude:
> *"I want to establish our spec for X. **Grill me** about it. Ask me targeted questions one by one until you have extracted all constraints. Then, write a summary and insert it into our database."*

### 3. Run Weekly "Dreaming" (Consolidation)
Before you shut down for the week, clean up redundancies and de-conflict outdated rules automatically by typing:
`C:/Users/beste/.claude/memory/bin/memory.sh consolidate`
This executes the local similarity scan—finding duplicate records, deprecating older conflicting rules using Temporal Dominance, and keeping your database fast and clean for Monday morning!
