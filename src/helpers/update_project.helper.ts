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
  try {
    copyFile('.gitignore', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}
  try {
    copyFile('.prettierignore', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}
  try {
    copyFile('eslint.config.js', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}
  try {
    copyFile('jest.config.js', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}
  try {
    copyFile('prettier.config.js', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}
  try {
    copyFile('tsconfig.json', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}
  try {
    copyFile('package.json', targetFolder, backupFolder);
    // eslint-disable-next-line no-empty
  } catch (_err) {}

  // Копируем файлы из template
  copyFile('.prettierignore', templateFolder, targetFolder);
  copyFile('eslint.config.js', templateFolder, targetFolder);
  copyFile('jest.config.js', templateFolder, targetFolder);
  copyFile('package.json', templateFolder, targetFolder);
  copyFile('prettier.config.js', templateFolder, targetFolder);
  copyFile('tsconfig.json', templateFolder, targetFolder);

  // Копируем остальные файлы
  copyFile('.gitignore', sourceFolder, targetFolder);
}
