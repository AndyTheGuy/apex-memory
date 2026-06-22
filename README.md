# 🧠 ApexMemory

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](package.json)
[![Platform Support](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-orange.svg)](install.js)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/AndyTheGuy/apex-memory/ci.yml?branch=main&label=CI%20Check)](.github/workflows/ci.yml)

**ApexMemory** is a production-grade, fully automated, cross-project, and 100% offline vector-semantic memory engine for Claude Code.

It combines **lightweight index routing**, **capped dynamic snapshotting**, **local WASM vector embeddings**, and **Temporal Conflict Resolution** to completely eliminate amnesia, prevent "Context Rot," and give Claude Code perfect contextual recall of all your past projects.

---

## ❓ Why ApexMemory?

For a tool this powerful, Claude Code's native memory behaves like a "silo." A style preference or server rule established in Project A is completely forgotten when you open a terminal in Project B. 

Furthermore, loading entire manuals or past conversations directly into `claude.md` burns money on every turn, slows down responses, and leads to **Context Rot** (where the LLM ignores instructions in the middle of a massive context window).

| Capability | Native Claude Code | ApexMemory |
| :--- | :--- | :--- |
| **Storage Type** | Plain-text logs (no search capability) | WASM Vector DB + Keyword Hybrid |
| **Search Method** | Keyword exact-match only | **Local Semantic + Keyword Hybrid** |
| **Context Control** | Uncapped/Unstructured (Context Rot risk) | **Strict 5-Slot Capped Threshold Gating** |
| **Cross-Project Sync** | Locked to local directory | **Universal Symlink Directory Junctions** |
| **Conflict Resolution** | Manual file deletion | **Temporal Dominance Auto-Consolidation** |
| **Project Setup** | Manual copy-pasting | **Automated `/init` Intersection Linker** |

---

## 🎨 System Architecture & Dataflow

ApexMemory operates entirely offline on your local machine, executing the following high-performance loop:

```
┌────────────────────────┐       ┌────────────────────────┐
│     User Dialogue      │ ◄────►│  Claude Code Session   │
└───────────┬────────────┘       └───────────▲────────────┘
            │                                │
            ▼ (Autologs Session)             │ Read Tool (On-Demand)
┌────────────────────────┐       ┌───────────┴────────────┐
│ ~/.claude/projects/*.j │       │ .claude/memory/        │
│      (JSONL Logs)      │       │     [ memory.md ]      │
└───────────┬────────────┘       │   (Dynamic Snapshot)   │
            │                    └───────────▲────────────┘
            ▼ (mine.js)                      │
┌────────────────────────┐       ┌───────────┴────────────┐
│   embed.js (WASM)      │       │      snapshot.js       │
│ all-MiniLM-L6-v2 ONNX  │ ─────►│   Vector Query &     │
└───────────┬────────────┘       │   Threshold Filter     │
            │                    └───────────▲────────────┘
            ▼ (Float32 Vectors)              │
┌────────────────────────┐       ┌───────────┴────────────┐
│    vector-db.js        │ ◄────►│     consolidate.js     │
│   store.json (DB)      │       │ (Conflict Resolution)  │
└────────────────────────┘       └────────────────────────┘
```

---

## 🛠️ Installation

Configure your global semantic brain in **under 30 seconds** on Windows, macOS, or Linux:

### 1. Clone the Repository
```bash
git clone https://github.com/AndyTheGuy/apex-memory.git
cd apex-memory
```

### 2. Run the Cross-Platform Setup Wizard
```bash
npm run install-global
```

*What the installer does:*
1. Generates `~/.claude/` global configuration folders if missing.
2. Deploys the memory package to your global configuration path `~/.claude/memory/`.
3. Installs the offline WASM-transformer model files locally (~80MB ONNX model).
4. Deploys your lightweight parent `claude.md` system prompt and hides it natively on Windows (`attrib +h`).
5. Performs a test compile of your dynamic snapshot.

---

## 💻 Practical Usage

ApexMemory is designed to be **completely hands-off in your daily conversations**. Once installed, it just works.

### The New Project Workflow

1. Create and enter any directory on your computer:
   ```bash
   mkdir next-gen-app && cd next-gen-app
   ```
2. Start Claude Code:
   ```bash
   claude
   ```
3. Type **`/init`** in your chat.
4. **The Automator Fires:** Claude reads your global developer profile and **automatically intercepts the setup**, executing this script in your active terminal:
   ```bash
   node ~/.claude/memory/bin/global-init.js
   ```
5. Your project is linked via Windows directory junctions to your centralized master brain, your local router is written, and you are ready to write code with perfect context retention!

---

## ⚡ Native Claude Code Slash Commands (Skills)

ApexMemory automatically deploys three high-performance, native global slash commands (skills) straight to your Claude Code interface on installation:

### 1. `/apex-init`
* **When to use:** When initializing an old or existing project folder for the first time.
* **What it does:** Executes your entire project setup natively in a single command. It links your folder, parses and vectorizes any past session histories, and compiles your snapshot.

### 2. `/apex-query "<your search query>"`
* **When to use:** To search your global vector database on the fly during active coding chats.
* **What it does:** Performs a local WASM-vector semantic search directly from your active conversation window.

### 3. `/apex-viz`
* **When to use:** To check your active database status, review your de-duplication counts, or see a visual mapping of your folder structure.
* **What it does:** Triggers your local visualization engine, rendering an interactive ASCII dataflow map and database metrics directly in your console.

---

## ⚙️ Manual Developer CLI Shortcuts

You can run these scripts inside your cloned repository folder to manage your database manually:

### 1. Mine Your Past Sessions (Seed Your Brain from Day 1)
```bash
npm run mine
```
*Recursively parses your global Claude Code logs directory, strips out IDE noise, and vectorizes all historical prompts across all folders on your machine.*

### 2. Query Your Vector Store (Semantic Search)
```bash
node cli.js query "gcp vertex api credentials setup"
```
*Executes a local WASM-vector query and displays matching conversation chunks with similarity scores and project folders.*

### 3. De-conflict & Consolidate (Weekly Cleaning)
```bash
npm run consolidate
```
*Finds overlapping entries, resolves contradictions using Temporal Dominance (newer rules supersede older ones), and automatically re-compiles your snapshot.*

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

## 🤝 Contribution & Security Governance

This repository is configured with professional open-source governance templates:
* **Pull Requests:** All incoming PRs are guarded by an automated **GitHub Actions CI Check** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) to verify JavaScript compilation and standard practices before merging.
* **Review Gate:** Branch protection rules require at least 1 approval from the project maintainer (**@AndyTheGuy**) before code can be merged into `main`. Direct pushes are blocked.
* See [CONTRIBUTING.md](CONTRIBUTING.md) for style requirements and PR workflows, and [SECURITY.md](SECURITY.md) for private vulnerability disclosure guidelines.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
