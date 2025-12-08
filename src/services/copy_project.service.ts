import path from 'path';

import { copyFile } from '../helpers/copy_file.helper';
import { copyRecursive } from '../helpers/copy_recursive.helper';

export async function copyProject(
  sourceFolder: string,
  targetFolder: string,
): Promise<void> {
  // Копируем файлы из template
  copyRecursive(path.join(sourceFolder, 'template'), targetFolder);

  // Копируем остальные файлы
  copyFile('.gitignore', sourceFolder, targetFolder);
  copyFile('LICENSE', sourceFolder, targetFolder);
  copyFile('README.md', sourceFolder, targetFolder);
}
