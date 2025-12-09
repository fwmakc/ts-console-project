import path from 'path';

import { copyProject } from './helpers/copy_project.helper';
import { error } from './helpers/error.helper';
import { installDependencies } from './helpers/install_dependencies.helper';
import { makeTargetFolder } from './helpers/make_target_folder.helper';
import { print } from './helpers/print.helper';
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
    const packageValues = await valuesPackage();

    const projectFolder = path.resolve(packageValues.name);
    const sourceFolder = path.resolve(__dirname, '..');

    // Проверяем и создаем каталог проекта
    await makeTargetFolder(projectFolder);

    // Копируем файлы проекта
    await copyProject(sourceFolder, projectFolder);

    // Обновляем package.json
    updatePackage(projectFolder, packageValues);

    print(['✅ Project created successfully!']);

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
