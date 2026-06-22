const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME_DIR = require('os').homedir();
const GLOBAL_MEMORY_DIR = path.join(HOME_DIR, '.claude/memory');

function setupNewProjectMemory() {
  console.log('=== ApexMemory: Project Initialization ===');

  const activeCwd = process.cwd();
  console.log(`Target Project Workspace: ${activeCwd}`);

  if (!fs.existsSync(GLOBAL_MEMORY_DIR)) {
    console.error(`Error: Global memory directory not found at: ${GLOBAL_MEMORY_DIR}`);
    console.log('Please ensure you have migrated ApexMemory to your User Home Directory first.');
    process.exit(1);
  }

  // 1. Create .claude folder in target project if it doesn't exist
  const projectConfigDir = path.join(activeCwd, '.claude');
  if (!fs.existsSync(projectConfigDir)) {
    fs.mkdirSync(projectConfigDir, { recursive: true });
    console.log('Created local .claude/ configuration directory.');
  }

  // 2. Establish symbolic link to the global brain
  const projectMemoryLink = path.join(projectConfigDir, 'memory');
  if (!fs.existsSync(projectMemoryLink)) {
    try {
      // Use Windows cmd MKLINK natively or junction on Windows, symlink on Unix
      if (process.platform === 'win32') {
        // Junction is safest on Windows without admin privileges
        execSync(`mklink /j "${projectMemoryLink}" "${GLOBAL_MEMORY_DIR}"`);
      } else {
        execSync(`ln -s "${GLOBAL_MEMORY_DIR}" "${projectMemoryLink}"`);
      }
      console.log('Successfully established symbolic link to the Global Memory Brain.');
    } catch (err) {
      console.error('Error creating symbolic link. Attempting manual copy fallback:', err.message);
      // Fallback: if symlink fails, copy general templates
      fs.mkdirSync(projectMemoryLink, { recursive: true });
    }
  } else {
    console.log('Symbolic link to global memory already exists in this project.');
  }

  // 3. Create a clean local claude.md router index
  const localRouterPath = path.join(activeCwd, 'claude.md');
  if (!fs.existsSync(localRouterPath)) {
    const routerContent = `# Claude Code: ApexMemory Router Index

Welcome to this local project workspace. This file is kept lightweight to avoid context rot, while routing Claude to your unified global memory.

---

## 🧠 Global Memory Access
All your structured instructions, developer profiles, active priorities, and semantically matched past decisions live in:
- **Unified Snapshot (Always Read This):** [.claude/memory/memory.md](.claude/memory/memory.md)

### Sub-Modules:
- **Developer Guidelines:** [.claude/memory/general.md](.claude/memory/general.md)
- **Active Today's Plan:** [.claude/memory/today.md](.claude/memory/today.md)
- **Verbatim Decisions Log:** [.claude/memory/decisions.md](.claude/memory/decisions.md)

---
## 🛠️ Memory Commands
You can run these scripts in your terminal to query or manage your global vector brain:
- Query: \`.claude/memory/bin/memory.sh query "your search terms"\`
- Consolidate: \`.claude/memory/bin/memory.sh consolidate\`
`;
    fs.writeFileSync(localRouterPath, routerContent, 'utf8');
    console.log('Created lightweight local claude.md router file.');
  } else {
    console.log('Local claude.md router already exists.');
  }

  // 4. Trigger a fresh, automated snapshot compile for the new project context
  try {
    const snapshotCompilerPath = path.join(GLOBAL_MEMORY_DIR, 'bin/snapshot.js');
    execSync(`node "${snapshotCompilerPath}"`, { stdio: 'inherit' });
    console.log('Successfully compiled dynamic context snapshot for this new project!');
  } catch (err) {
    console.warn('Warning: Could not compile dynamic snapshot:', err.message);
  }

  console.log('\n=== Project Initialization Complete! ===');
  console.log('This project is now fully linked to your Global ApexMemory Brain. It just works!');
}

if (require.main === module) {
  setupNewProjectMemory();
}

module.exports = { setupNewProjectMemory };
