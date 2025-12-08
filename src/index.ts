import path from 'path';

import { error } from './helpers/error.helper';
import { print } from './helpers/print.helper';
import { updatePackageJson } from './helpers/update_package_json.helper';
import { copyProject } from './services/copy_project.service';
import { installDependencies } from './services/install_dependencies.service';
import { makeTargetFolder } from './services/make_target_folder.service';
import { preparePackageValues } from './services/prepare_package_values.service';

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
    // Парсим аргументы командной строки
    const args = process.argv.slice(2);

    const packageValues = await preparePackageValues(args);

    const projectFolder = path.resolve(packageValues.name);
    const sourceFolder = path.resolve(__dirname, '..');

    // Проверяем и создаем каталог проекта
    await makeTargetFolder(projectFolder);

    // Копируем файлы проекта
    await copyProject(sourceFolder, projectFolder);

    // Обновляем package.json
    updatePackageJson(projectFolder, packageValues);

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
