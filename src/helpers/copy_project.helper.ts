import path from 'path';

import { copyFile } from './copy_file.helper';
import { copyRecursive } from './copy_recursive.helper';
import { makeTargetFolder } from './make_target_folder.helper';

export async function copyProject(
  sourceFolder: string,
  targetFolder: string,
): Promise<void> {
  // Проверяем и создаем каталог проекта
  await makeTargetFolder(targetFolder);

  // Копируем файлы из template
  copyRecursive(path.join(sourceFolder, 'template'), targetFolder);

  // Копируем остальные файлы
  copyFile('.gitignore', sourceFolder, targetFolder);
  copyFile('LICENSE', sourceFolder, targetFolder);
  copyFile('README.md', sourceFolder, targetFolder);
}
