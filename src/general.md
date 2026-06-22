# Developer Profile & Environment Rules

## Environment Context
- **OS**: Windows 11 Home (win32, Git Bash POSIX syntax preferred in shell)
- **Primary Workspace**: `c:/Users/beste/Documents/claude_code/claude-custom-improvements`
- **Invoked Date**: 2026-06-22

## Preferences & Formatting
- **Coding Style**: Clean, modern CommonJS/ESM Node.js code, appropriate comment density.
- **Reference Code**: Always use clickable markdown link format (e.g., `[file.ts](src/file.ts)` or `[file.ts:42](src/file.ts#L42)`) when referencing file locations inside text. DO NOT use backticks for file locations unless requested.
- **Behavior**: Be highly detailed, factual, and direct. Verify changes before shipping.

## Automated Project Initialization Hook
- **Trigger**: Whenever the user invokes the `/init` command, asks to "initialize a project", "start a project", "set up CLAUDE.md", or runs in a new directory for the first time.
- **Action**: You must **automatically execute this local script** in the current terminal *before* generating standard CLAUDE.md files:
  ```bash
  node C:/Users/beste/.claude/memory/bin/global-init.js
  ```
- **Reason**: This script automatically establishes the local `.claude/` directory junction linking back to your global memory brain, creates the local lightweight `claude.md` router, and compiles a fresh, workspace-focused context snapshot. It removes all manual configuration steps completely.
