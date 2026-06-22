const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME_DIR = os.homedir();
const GLOBAL_CLAUDE_DIR = path.join(HOME_DIR, '.claude');
const GLOBAL_MEMORY_DIR = path.join(GLOBAL_CLAUDE_DIR, 'memory');

console.log('====================================================');
console.log('      🧠 Welcome to the ApexMemory Setup Wizard 🧠   ');
console.log('====================================================');
console.log(`Detecting OS: ${os.type()} (${os.platform()})`);
console.log(`User Home Folder: ${HOME_DIR}`);

// Helper to recursively copy directories synchronously
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

async function run() {
  try {
    // 1. Ensure global .claude folder exists
    if (!fs.existsSync(GLOBAL_CLAUDE_DIR)) {
      fs.mkdirSync(GLOBAL_CLAUDE_DIR, { recursive: true });
      console.log(`[+] Created global configuration folder: ${GLOBAL_CLAUDE_DIR}`);
    }

    // 2. Deploy sub-package files to ~/.claude/memory/
    console.log(`[~] Deploying ApexMemory binaries to ${GLOBAL_MEMORY_DIR}...`);
    if (fs.existsSync(GLOBAL_MEMORY_DIR)) {
      console.log('[!] Existing ApexMemory binary folder found. Backing up and overwriting...');
      const backupDir = GLOBAL_MEMORY_DIR + '_backup_' + Date.now();
      fs.renameSync(GLOBAL_MEMORY_DIR, backupDir);
    }

    const srcDir = path.join(__dirname, 'src');
    copyFolderSync(srcDir, GLOBAL_MEMORY_DIR);
    console.log('[+] ApexMemory scripts successfully deployed.');

    // 3. Automatically execute 'npm install' inside the global brain directory
    console.log('[~] Installing WASM-embeddings dependencies inside global folder (WASM Model is ~80MB)...');
    try {
      execSync('npm install', { cwd: GLOBAL_MEMORY_DIR, stdio: 'inherit' });
      console.log('[+] Dependency installation complete!');
    } catch (npmErr) {
      console.error('[!] Warning: NPM installation had issues:', npmErr.message);
      console.log('You may need to run "npm install" inside ~/.claude/memory manually.');
    }

    // 4. Install Global Router claude.md inside ~/.claude/claude.md
    const globalRouterPath = path.join(GLOBAL_CLAUDE_DIR, 'claude.md');
    const templatePath = path.join(GLOBAL_MEMORY_DIR, 'template-claude.md');
    fs.copyFileSync(templatePath, globalRouterPath);
    console.log(`[+] Installed master router to: ${globalRouterPath}`);

    // 5. Establish folder-climbing link in User Home and hide it
    const homeRouterLink = path.join(HOME_DIR, 'claude.md');
    if (!fs.existsSync(homeRouterLink)) {
      console.log(`[~] Setting up hidden parent router in home directory: ${homeRouterLink}`);
      try {
        if (os.platform() === 'win32') {
          // Create directory or file link on Windows
          fs.writeFileSync(homeRouterLink, fs.readFileSync(globalRouterPath, 'utf8'), 'utf8');
          // Hide it natively using cmd attrib +h
          execSync(`attrib +h "${homeRouterLink}"`);
          console.log('[+] Created hidden global router in User Home Folder.');
        } else {
          // Standard symlink on Unix
          fs.symlinkSync(globalRouterPath, homeRouterLink);
          console.log('[+] Created global router symbolic link in User Home Folder.');
        }
      } catch (linkErr) {
        console.warn('[!] Non-critical link warning:', linkErr.message);
      }
    } else {
      console.log('[i] Home directory router already exists.');
    }

    // 6. Test-compile initial snapshot to verify setup
    console.log('[~] Running initial memory snapshot compilation...');
    try {
      const snapshotScript = path.join(GLOBAL_MEMORY_DIR, 'bin/snapshot.js');
      execSync(`node "${snapshotScript}"`, { stdio: 'inherit' });
      console.log('[+] Initial context snapshot successfully compiled!');
    } catch (snapErr) {
      console.error('[!] Error compiling initial snapshot:', snapErr.message);
    }

    console.log('\n====================================================');
    console.log('     🎉 ApexMemory Global Installation Complete! 🎉   ');
    console.log('====================================================');
    console.log('\nHow to start using it:');
    console.log('1. Open any of your project directories.');
    console.log('2. Start a new Claude Code session.');
    console.log('3. Run the "/init" command.');
    console.log('   The system will automatically link, configure, and');
    console.log('   load your global semantic memory snapshot!');
    console.log('\nYour memory is 100% offline, 100% secure, and 100% free.');
    console.log('Enjoy developing with perfect context retention!\n');

  } catch (err) {
    console.error('\n[!] Critical Setup Error occurred:', err);
    process.exit(1);
  }
}

run();
