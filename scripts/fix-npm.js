import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const lockFilePath = path.join(process.cwd(), 'package-lock.json');

console.log('[v0] Checking for corrupted package-lock.json...');

if (fs.existsSync(lockFilePath)) {
  console.log('[v0] Found package-lock.json, removing it to regenerate...');
  fs.unlinkSync(lockFilePath);
  console.log('[v0] Deleted package-lock.json');
}

console.log('[v0] Running npm install with legacy peer deps...');
try {
  execSync('npm install --legacy-peer-deps', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('[v0] Dependencies installed successfully!');
} catch (error) {
  console.error('[v0] Error installing dependencies:', error.message);
  process.exit(1);
}
