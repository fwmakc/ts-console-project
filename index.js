#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Задаем значения по-умолчанию
const defaults = {
  projectName: 'ts-console-project',
  version: '0.1.0',
  productName: 'TS Console Project',
  description: 'TypeScript console application',
  repository: '',
  author: '',
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function copyFile(filename, src, dest) {
  fs.copyFileSync(path.join(src, filename), path.join(dest, filename));
}

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src);

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

async function executeNextSteps(targetDir, silent = false) {
  console.log('\n🔧 Executing next steps...\n');

  try {
    // 1. Переходим в директорию проекта
    process.chdir(targetDir);
    console.log('📁 Changed to project directory');

    // 2. Автоматическое определение или выбор менеджера пакетов
    const detectedManager = detectPackageManager();
    let selectedPackageManager = detectedManager;
    if (!silent) {
      const packageManagerAnswer = await question(`Package manager (npm/yarn, default: ${detectedManager}): `) || detectedManager;
      const validPackageManagers = ['npm', 'yarn'];
      selectedPackageManager = validPackageManagers.includes(packageManagerAnswer.toLowerCase()) 
        ? packageManagerAnswer.toLowerCase() 
        : detectedManager;
    }
    console.log(`📦 Using package manager: ${selectedPackageManager}`);

    // 3. Устанавливаем зависимости
    console.log('📦 Installing dependencies...');
    execSync(`${selectedPackageManager} install`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Error executing next steps:', error.message);
  }
}

function isDirectoryEmpty(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return true;
    }

    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      console.error(`❌ Path is not a directory: ${dirPath}`);
      return false;
    }

    const files = fs.readdirSync(dirPath);
    return files.length === 0;
  } catch (error) {
    console.error(`❌ Error checking directory: ${error.message}`);
    return false;
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

    if (fields.version) packageJson.version = fields.version;
    if (fields.productName) packageJson.productName = fields.productName;
    if (fields.description) packageJson.description = fields.description;
    if (fields.repository) packageJson.repository = fields.repository;
    if (fields.author) packageJson.author = fields.author;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

async function main() {
  console.log('🚀 Creating TypeScript Console Project');
  console.log('(will be installed in project name folder)\n');

  // Парсим аргументы командной строки
  const args = process.argv.slice(2);
  const projectNameFromArgs = String(args?.[0] || '').trim();

  if (projectNameFromArgs) {
    defaults.projectName = projectNameFromArgs;
  } else {
    defaults.projectName = await question(`Project name (${defaults.projectName}): `) || defaults.projectName;

    const version = await question(`Version (${defaults.version}): `) || defaults.version;
    const versionParts = version.split('.');

    for (let i = versionParts.length; i < 3; i++) {
      versionParts.push(0);
    }

    defaults.version = versionParts.join('.');

    defaults.productName = await question(`Product name (${defaults.productName}): `) || defaults.productName;
    defaults.description = await question('Description: ') || defaults.description;
    defaults.repository = await question('Repository url: ') || defaults.repository;

    let author = await question('Author: ') || '';
    author = author.trim();

    if (author) {
      let email = await question('Email: ') || '';
      email = email.trim();

      const authors = [];
      if (author) {
        authors.push(author);
      }
      if (email && email !== author) {
        authors.push(`<${email}>`);
      }

      defaults.author = authors.join(' ');
    }
  }

  const targetDir = path.resolve(defaults.projectName);

  // Проверяем, существует ли директория
  if (!isDirectoryEmpty(targetDir)) {
    const overwrite = await question(`Directory "${targetDir}" already exists. Overwrite? (y/N): `);
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

    // Копируем остальные файлы
    copyFile('.gitignore', __dirname, targetDir);
    copyFile('LICENSE', __dirname, targetDir);
    copyFile('README.md', __dirname, targetDir);

    // Обновляем package.json
    updatePackageJson(targetDir, {
      name: defaults.projectName.trim(),
      version: defaults.version.trim(),
      productName: defaults.productName.trim(),
      description: defaults.description.trim(),
      repository: defaults.repository.trim(),
      author: defaults.author.trim()
    });

    console.log('\n✅ Project created successfully!');

    // Переходим к Next steps
    console.log('\nNext steps:');
    console.log(`📁 cd ${defaults.projectName}`);
    console.log('📦 npm install');
    console.log('⭐ npm run dev');

    if (projectNameFromArgs) {
      await executeNextSteps(targetDir, true);
    } else {
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
