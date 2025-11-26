#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Задаем значения по-умолчанию
const defaults = {
  projectName: 'ts-console-project',
  productName: 'TS Console Project',
  description: 'TypeScript console application',
  author: '',
  targetFolder: 'ts-console-project'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function detectPackageManager() {
  try {
    // Проверяем, установлен ли yarn
    execSync('yarn --version', { stdio: 'ignore' });
    return 'yarn';
  } catch (error) {
    // Если yarn не установлен, используем npm
    return 'npm';
  }
}

async function executeNextSteps(targetDir) {
  console.log('\n🔧 Executing next steps...\n');

  try {
    // 1. Переходим в директорию проекта
    process.chdir(targetDir);
    console.log('📁 Changed to project directory');

    // 2. Автоматическое определение или выбор менеджера пакетов
    const detectedManager = detectPackageManager();
    const packageManagerAnswer = await question(`Package manager (npm/yarn, default: ${detectedManager}): `) || detectedManager;
    const validPackageManagers = ['npm', 'yarn'];
    const selectedPackageManager = validPackageManagers.includes(packageManagerAnswer.toLowerCase()) 
      ? packageManagerAnswer.toLowerCase() 
      : detectedManager;
    console.log(`📦 Using package manager: ${selectedPackageManager}`);

    // 3. Устанавливаем зависимости
    console.log('📦 Installing dependencies...');
    execSync(`${selectedPackageManager} install`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Error executing next steps:', error.message);
  }
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function updatePackageJson(targetDir, fields) {
  const packageJsonPath = path.join(targetDir, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Обновляем только указанные поля
    packageJson.name = fields.name;

    if (fields.productName) packageJson.productName = fields.productName;
    if (fields.description) packageJson.description = fields.description;
    if (fields.author) packageJson.author = fields.author;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

async function main() {
  console.log('🚀 Creating TypeScript Console Project...\n');

  // Парсим аргументы командной строки
  const args = process.argv.slice(2);
  const projectNameFromArgs = String(args?.[0] || '').trim();
  const targetFolderFromArgs = String(args?.[1] || '').trim();
  const autoInstall = projectNameFromArgs;
  
  if (autoInstall) {
    defaults.projectName = projectNameFromArgs;
    defaults.targetFolder = targetFolderFromArgs || projectNameFromArgs;
  }

  if (!autoInstall) {
    defaults.projectName = await question(`Project name (${defaults.projectName}): `) || defaults.projectName;
    defaults.productName = await question(`Product name (${defaults.productName}): `) || defaults.productName;
    defaults.description = await question('Description: ') || defaults.description;
    defaults.author = await question('Author: ') || defaults.author;
    defaults.targetFolder = await question(`Folder name (${defaults.targetFolder}) or . for current: `) || defaults.targetFolder;
  }

  const targetDir = path.resolve(defaults.targetFolder);

  // Проверяем, существует ли директория
  if (fs.existsSync(targetDir)) {
    const overwrite = await question(`Directory "${defaults.targetFolder}" already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled');
      rl.close();
      return;
    }
    // Удаляем существующую директорию
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  try {
    // Создаем директорию
    fs.mkdirSync(targetDir, { recursive: true });

    // Копируем файлы из template
    copyRecursive(path.join(__dirname, 'template'), targetDir);
    copyRecursive(path.join(__dirname, '.gitignore'), targetDir);
    copyRecursive(path.join(__dirname, 'LICENSE'), targetDir);
    copyRecursive(path.join(__dirname, 'README.md'), targetDir);

    // Обновляем package.json
    updatePackageJson(targetDir, {
      name: defaults.projectName,
      productName: defaults.productName,
      description: defaults.description,
      author: defaults.author
    });

    console.log('\n✅ Project created successfully!');

    // Переходим к Next steps
    console.log('\nNext steps:');
    if (defaults.targetFolder !== '.') {
      console.log(`📁 cd ${defaults.targetFolder}`);
    }
    console.log('📦 npm install');
    console.log('⭐ npm run dev');

    if (!autoInstall) {
      // Запрашиваем выполнение Next steps
      const executeSteps = await question('\nInstall dependencies automatically? (y/N): ');

      if (executeSteps.toLowerCase() === 'y') {
        await executeNextSteps(targetDir);
      }
    }

    console.log('\nHappy coding! 👋');
  } catch (error) {
    console.error('❌ Error creating project:', error);
  } finally {
    rl.close();
  }
}

// Запускаем основную функцию
main().catch(console.error);
