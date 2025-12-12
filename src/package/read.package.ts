import { existsSync, readFileSync } from 'fs';
import path from 'path';

import type { IPackage } from '../interfaces/package.interface';
import { confirm } from '../prompts/confirm.prompt';

export async function readPackage(
  currentFolder: string,
): Promise<IPackage | undefined> {
  try {
    const packageJsonPath = path.resolve(currentFolder, 'package.json');

    if (!existsSync(packageJsonPath)) {
      return;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    if (packageJson) {
      const isUpdate = await confirm(
        'Found package.json file. Update project?',
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
