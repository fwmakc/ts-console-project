import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import path from 'path';

export function copyRecursive(src: string, dest: string): void {
  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}
