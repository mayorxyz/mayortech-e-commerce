#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

const lockPath = './package-lock.json';

console.log('[v0] Regenerating package-lock.json...');

// Remove existing corrupted lock file
if (existsSync(lockPath)) {
  console.log('[v0] Removing corrupted lock file...');
  rmSync(lockPath);
}

// Regenerate lock file
console.log('[v0] Running npm install to regenerate lock...');
try {
  execSync('npm install --legacy-peer-deps --package-lock-only', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('[v0] ✓ Lock file regenerated successfully!');
} catch (err) {
  console.error('[v0] Error regenerating lock:', err.message);
  process.exit(1);
}
