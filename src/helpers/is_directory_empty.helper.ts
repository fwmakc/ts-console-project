import { existsSync, readdirSync, statSync } from 'fs';

import { error } from './error.helper';

export function isDirectoryEmpty(dirPath: string): boolean {
  try {
    if (!existsSync(dirPath)) {
      return true;
    }

    const stats = statSync(dirPath);
    if (!stats.isDirectory()) {
      error(`Path is not a directory: ${dirPath}`, null);
      return false;
    }

    const files = readdirSync(dirPath);
    return files.length === 0;
  } catch (err) {
    error('Error checking directory', err);
    return false;
  }
}
