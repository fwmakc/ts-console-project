import { existsSync, readFileSync } from 'fs';
import path from 'path';

import type { IPackage } from '../interfaces/package.interface';
import { confirm } from '../prompts/confirm.prompt';

export async function readPackage(
  currentFolder: string,
): Promise<IPackage | undefined> {
  const packageJsonPath = path.resolve(currentFolder, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    if (packageJson) {
      const isUpdate = await confirm(
        'File package.json found. Can update?',
        true,
      );
      if (isUpdate) {
        return packageJson;
      }
    }
  } catch (_err) {
    return;
  }

  return;
}
