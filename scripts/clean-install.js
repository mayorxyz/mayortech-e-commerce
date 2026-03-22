import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const nodeMod = join(projectRoot, 'node_modules');
const lockFile = join(projectRoot, 'package-lock.json');
const packageTemp = join(projectRoot, 'package-temp.json');

console.log('[v0] Starting clean npm installation...');

// Remove node_modules
if (existsSync(nodeMod)) {
  console.log('[v0] Removing node_modules...');
  rmSync(nodeMod, { recursive: true, force: true });
}

// Remove package-lock.json
if (existsSync(lockFile)) {
  console.log('[v0] Removing corrupted package-lock.json...');
  rmSync(lockFile, { force: true });
}

// Run npm cache clean
console.log('[v0] Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (e) {
  console.log('[v0] Cache clean warning (non-critical):', e.message);
}

// Fresh install
console.log('[v0] Running fresh npm install...');
try {
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit',
    cwd: projectRoot 
  });
  console.log('[v0] ✓ Dependencies installed successfully!');
} catch (e) {
  console.error('[v0] ✗ Installation failed:', e.message);
  process.exit(1);
}
