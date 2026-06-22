# 🧠 ApexMemory: Elite Local Semantic Memory for Claude Code

ApexMemory is a fully automated, cross-project, self-improving, and 100% offline vector-semantic memory engine for Claude Code.

It combines **lightweight index routing**, **capped dynamic snapshotting**, **local WASM vector embeddings (Zero API cost)**, and **Temporal Conflict Resolution** to completely eliminate amnesia, prevent "Context Rot," and give Claude Code perfect contextual recall of all your past projects.

---

## 🚀 Key Features (No Shortcuts)

* **100% Local WASM Inference:** Calculates 384-dimensional dense semantic vector embeddings natively on your machine using an offline ONNX neural network pipeline (`all-MiniLM-L6-v2`, ~80MB). **Zero cloud costs, zero latency, and absolute privacy.**
* **Hybrid & Re-ranked Database:** Computes query relevance using **70% Cosine Vector Similarity + 30% Keyword overlap**, guaranteeing exact commands (e.g. "/ponytail-review") and conceptually related ideas (e.g. "Stripe" and "payments") match flawlessly.
* **Overlapping Sliding Window Chunker:** Automatically partitions bulky past inputs (like long terminal logs or copy-pastes) into focused 1,000-character blocks, guarding your context window against giant walls of code.
* **Temporal Conflict Resolution (Self-Cleaning):** Scans active records for conceptual overlaps (similarity `> 0.80`) and automatically deprecates older contradictory rules using Temporal Dominance.
* **Dynamic Snapshotting (Context-Saving):** Restricts compiled snapshots to memories scoring `>= 0.28`. You only load context directly matching today's active priorities, saving thousands of tokens per chat.
* **Automated `/init` Project Interceptor:** Integrates with Claude Code natively. When you type `/init` in a new workspace, Claude automatically detects the request, establishes a Windows directory junction back to your global database, writes local files, and compiles your snapshot in the background.

---

## 📁 Repository Structure

```
apex-memory/
├── README.md               # You are here!
├── package.json            # Global installation and utility scripts
├── install.js              # The Pure JavaScript Setup Wizard (cross-platform)
├── cli.js                  # Developer CLI Proxy (for local command shortcuts)
└── src/                    # The Master Brain package (copied to ~/.claude/memory)
    ├── package.json        # Sub-package WASM dependencies
    ├── general.md          # Static Developer Profile & Environment guidelines
    ├── decisions.md        # Verbatim Decision Log template
    ├── today.md            # Active daily tasks profile (Focus Lens)
    ├── template-claude.md  # System routing prompt template
    └── bin/
        ├── embed.js        # Offline embeddings generator
        ├── vector-db.js    # Similarity search database engine
        ├── mine.js         # Back-Catalog session logs miner
        ├── snapshot.js     # Snapshot compiler (loads memory.md)
        ├── consolidate.js  # Automated de-confliction engine
        └── global-init.js  # Project Directory Junction Linker
```

---

## 🛠️ Installation

Get fully configured in **under 30 seconds** on Windows, macOS, or Linux:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/apex-memory.git
cd apex-memory
```

### 2. Run the Cross-Platform Setup Wizard
```bash
npm run install-global
```
*What the wizard does:*
1. Generates `~/.claude/` global workspace configurations if missing.
2. Deploys the memory package to `~/.claude/memory/`.
3. Installs the offline WASM-transformer model files locally.
4. Deploys your lightweight parent `claude.md` system prompt and hides it natively on Windows.
5. Performs a test compile of your dynamic snapshot.

---

## 💻 Practical Usage

ApexMemory is designed to be **completely hands-off in your daily conversations**. Once installed, it just works.

### The New Project Workflow
1. Create and enter any directory on your computer:
   ```bash
   mkdir my-brand-new-project && cd my-brand-new-project
   ```
2. Start Claude Code:
   ```bash
   claude
   ```
3. Type `/init` in your chat.
4. **The Automator Fires:** Claude reads your global developer profile and **automatically intercepts the setup**, executing `node ~/.claude/memory/bin/global-init.js` in your active terminal.
5. Your project is linked via Windows directory junctions to your centralized master brain, your local router is written, and you are ready to write code with perfect context retention!

---

## ⚙️ Manual Maintenance (Developer Shortcuts)

You can run these scripts inside the cloned repository to manage your database manually:

### 1. Mine Your Past Sessions (Seed Your Brain from Day 1)
```bash
npm run mine
```
*Scans your global Claude Code logs folder recursively and vectorizes all historical prompts across all folders on your machine.*

### 2. Query Your Vector Store (Semantic Search)
```bash
node cli.js query "how do we handle database constraints"
```
*Executes a local vector search over past session records and displays matching chunks with similarity scores and project folders.*

### 3. De-conflict & Consolidate (Weekly Cleaning)
```bash
npm run consolidate
```
*Finds overlapping entries, resolves contradictions using Temporal Dominance, and automatically re-compiles your dynamic snapshot index.*

### 4. Insert a Custom Memory Rule
```bash
node cli.js insert "We decide to use CamelCase for SQL database columns." "DirectPrompt" "preferences"
```

---

## 🎨 Real-Time Graph Visualizations (Obsidian)

Because your database persists chunks in highly structured Markdown files alongside your JSON vector store, you can visualize your entire global brain as an interactive knowledge graph:

1. Download and install [Obsidian](https://obsidian.md/) (100% free, local).
2. Click **"Open folder as vault"** and select your global memory folder: `~/.claude/memory/`.
3. Open the **"Graph View"** from the left sidebar.

As Claude Code registers new decisions or resolves duplicates, **Obsidian will update your visual map in real time on your screen**, showing nodes connecting and organizing automatically.

---

## 📄 License
This project is open-source and licensed under the MIT License.
