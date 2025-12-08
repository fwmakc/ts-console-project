import { copyFileSync } from 'fs';
import path from 'path';

export function copyFile(filename: string, src: string, dest: string): void {
  copyFileSync(path.join(src, filename), path.join(dest, filename));
}
