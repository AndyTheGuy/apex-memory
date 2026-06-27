const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const HOME_DIR = os.homedir();
const GLOBAL_CLAUDE_DIR = path.join(HOME_DIR, '.claude');
const GLOBAL_MEMORY_DIR = path.join(GLOBAL_CLAUDE_DIR, 'memory');
const DB_PATH = path.join(GLOBAL_MEMORY_DIR, 'db/store.json');
const BYPASS_PATH = path.join(GLOBAL_CLAUDE_DIR, 'disabled');

const TEMPLATE_PATH = path.join(GLOBAL_MEMORY_DIR, 'dashboard_template.html');
const COMPILED_PATH = path.join(GLOBAL_MEMORY_DIR, 'dashboard_compiled.html');

function launchDashboard() {
  console.log('=== ApexMemory: Launching Real-Time Local Dashboard ===');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Error: Dashboard template not found at: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  // 1. Gather live database metrics
  let dbState = { records: [] };
  let sizeKb = "0.00";
  const isDisabled = fs.existsSync(BYPASS_PATH);

  if (fs.existsSync(DB_PATH)) {
    try {
      const stats = fs.statSync(DB_PATH);
      sizeKb = (stats.size / 1024).toFixed(2);
      dbState = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (err) {
      console.warn('Warning: Could not read database metrics:', err.message);
    }
  }

  // 2. Compile live state into the HTML template
  let templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const databaseStateInjection = `const DATABASE_STATE = ${JSON.stringify(dbState)};`;
  const metricsInjection = `const SYSTEM_METRICS = { disabled: ${isDisabled}, sizeKb: "${sizeKb}" };`;

  // Safe string replacements
  templateContent = templateContent
    .replace('const DATABASE_STATE = { records: [] };', databaseStateInjection)
    .replace('const SYSTEM_METRICS = { disabled: false, sizeKb: "0.00" };', metricsInjection);

  fs.writeFileSync(COMPILED_PATH, templateContent, 'utf8');
  console.log(`[+] Dashboard compiled successfully at: ${COMPILED_PATH}`);

  // 3. Open in user's default browser natively
  console.log('[~] Opening local file in browser...');
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${COMPILED_PATH}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${COMPILED_PATH}"`);
    } else {
      execSync(`xdg-open "${COMPILED_PATH}"`);
    }
    console.log('✓ Browser Launched. Enjoy your ApexMemory dashboard!');
  } catch (err) {
    console.error('Error opening browser. You can manually double-click the file to open:', COMPILED_PATH);
  }
}

if (require.main === module) {
  launchDashboard();
}

module.exports = { launchDashboard };
