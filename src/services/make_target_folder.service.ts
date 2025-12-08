import { mkdirSync, rmSync } from 'fs';

import { error } from '../helpers/error.helper';
import { isDirectoryEmpty } from '../helpers/is_directory_empty.helper';
import { confirm } from '../prompts/confirm.prompt';

export async function makeTargetFolder(targetDir: string): Promise<void> {
  // Проверяем, существует ли директория
  if (!isDirectoryEmpty(targetDir)) {
    const overwrite = await confirm(
      `Directory "${targetDir}" already exists. Overwrite?`,
      false,
    );

    if (!overwrite) {
      error('Operation cancelled', null);
    }

    // Удаляем существующую директорию
    rmSync(targetDir, { recursive: true, force: true });
  }

  try {
    // Создаем директорию
    mkdirSync(targetDir, { recursive: true });
  } catch (err) {
    error('Error executing next steps', err);
  }
}
