import path from 'path';

import { copyFile } from './copy_file.helper';
import { makeTargetFolder } from './make_target_folder.helper';

export async function updateProject(
  sourceFolder: string,
  targetFolder: string,
): Promise<void> {
  const templateFolder = path.join(sourceFolder, 'template');
  const backupFolder = path.join(targetFolder, '.backup');

  // Проверяем и создаем каталог бэкапа проекта
  await makeTargetFolder(backupFolder);

  // Делаем бэкап
  copyFile('.gitignore', targetFolder, backupFolder);
  copyFile('.prettierignore', targetFolder, backupFolder);
  copyFile('eslint.config.js', targetFolder, backupFolder);
  copyFile('jest.config.js', targetFolder, backupFolder);
  copyFile('package.json', targetFolder, backupFolder);
  copyFile('prettier.config.js', targetFolder, backupFolder);
  copyFile('tsconfig.json', targetFolder, backupFolder);

  // Копируем файлы из template
  copyFile('.prettierignore', templateFolder, targetFolder);
  copyFile('eslint.config.js', templateFolder, targetFolder);
  copyFile('jest.config.js', templateFolder, targetFolder);
  copyFile('prettier.config.js', templateFolder, targetFolder);
  copyFile('tsconfig.json', templateFolder, targetFolder);

  // Копируем остальные файлы
  copyFile('.gitignore', sourceFolder, targetFolder);
}
