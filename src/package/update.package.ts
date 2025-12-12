import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { error } from '../helpers/error.helper';
import type { IPackage } from '../interfaces/package.interface';

export function updatePackage(targetDir: string, fields: IPackage): void {
  const packageJsonPath = path.join(targetDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    error(`File not found: ${packageJsonPath}`, null);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  const {
    name,
    version,
    productName,
    description,
    license,
    keywords,
    author,
    repository,
    bugs,
    homepage,
    main,
    types,
    scripts,
    devDependencies,
    dependencies,
    ...otherFields
  } = fields;

  // Обновляем только указанные поля
  packageJson.name = fields.name;

  if (fields.version) packageJson.version = fields.version;
  if (fields.productName) packageJson.productName = fields.productName;
  if (fields.description) packageJson.description = fields.description;
  if (fields.license) packageJson.license = fields.license;
  if (fields.keywords) packageJson.keywords = fields.keywords;
  if (fields.author) packageJson.author = fields.author;
  if (fields.repository) packageJson.repository = fields.repository;
  if (fields.bugs) packageJson.bugs = fields.bugs;
  if (fields.homepage) packageJson.homepage = fields.homepage;
  if (fields.main) packageJson.main = fields.main;
  if (fields.types) packageJson.types = fields.types;

  if (fields.scripts)
    packageJson.scripts = { ...fields.scripts, ...packageJson.scripts };

  if (fields.devDependencies)
    packageJson.devDependencies = {
      ...fields.devDependencies,
      ...packageJson.devDependencies,
    };

  if (fields.dependencies)
    packageJson.dependencies = {
      ...fields.dependencies,
      ...packageJson.dependencies,
    };

  try {
    writeFileSync(
      packageJsonPath,
      JSON.stringify({ ...packageJson, ...otherFields }, null, 2),
    );
  } catch (err) {
    error('Error write package.json', err);
  }
}
