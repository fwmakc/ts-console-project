import { execSync } from 'child_process';

import { detectPackageManagers } from '../helpers/detect_package_managers.helper';
import { error } from '../helpers/error.helper';
import { print } from '../helpers/print.helper';
import { select } from '../prompts/select.prompt';
import { confirm } from '../prompts/confirm.prompt';

export async function installDependencies(targetFolder: string): Promise<void> {
  const executeSteps = await confirm('Install dependencies?', true);

  if (!executeSteps) {
    return;
  }

  try {
    // 1. Переходим в директорию проекта
    process.chdir(targetFolder);

    // 2. Автоматическое определение или выбор менеджера пакетов
    const packageManagers: string[] = detectPackageManagers();

    let selectedPackageManager = packageManagers[0];

    if (packageManagers.length > 1) {
      const packageManagerAnswer = await select(
        'Package manager',
        packageManagers,
      );

      selectedPackageManager = packageManagerAnswer;
    }

    // 3. Устанавливаем зависимости
    print([
      `📦 Using package manager: ${selectedPackageManager}`,
      '📦 Installing dependencies...',
    ]);
    execSync(`${selectedPackageManager} install`, { stdio: 'inherit' });
    print(['✅ Dependencies installed']);
  } catch (err) {
    error('Error executing next steps', err);
  }
}
