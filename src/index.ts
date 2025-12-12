import path from 'path';

import { copyProject } from './helpers/copy_project.helper';
import { error } from './helpers/error.helper';
import { installDependencies } from './helpers/install_dependencies.helper';
import { print } from './helpers/print.helper';
import { updateProject } from './helpers/update_project.helper';
import { readPackage } from './package/read.package';
import { updatePackage } from './package/update.package';
import { valuesPackage } from './package/values.package';

async function main(): Promise<void> {
  print([
    '🚀 Creating TypeScript Console Project',
    '(will be installed in project name folder)',
    '',
    '⚠️  keys:',
    'arrows - select',
    '[enter] - confirm',
    '[esc] - abort and exit',
    '[space] - switch or clear',
    '[tab] - edit default value',
  ]);

  try {
    const arg = process.argv.slice(2)?.[0]?.trim() || '';

    const currentFolder = path.resolve(arg);
    const packageJson = await readPackage(currentFolder);
    const packageValues = await valuesPackage(packageJson);

    const isUpdate = Boolean(packageJson);

    const projectFolder =
      isUpdate || arg ? currentFolder : path.resolve(packageValues.name);
    const sourceFolder = path.resolve(__dirname, '..');

    if (isUpdate) {
      // Обновляем файлы проекта
      await updateProject(sourceFolder, projectFolder);
    } else {
      // Копируем файлы проекта
      await copyProject(sourceFolder, projectFolder);
    }

    // Обновляем package.json
    updatePackage(projectFolder, packageValues);

    print([`✅ Project created successfully!`]);

    // Запрашиваем установку зависимостей
    await installDependencies(projectFolder);

    print([
      'Next steps:',
      `📁 cd ${packageValues.name}`,
      '📦 npm install',
      '⭐ npm run dev',
      '',
      'Happy coding! 👋',
    ]);
  } catch (err) {
    error('Error creating project', err);
  }
}

main().catch(console.error);
