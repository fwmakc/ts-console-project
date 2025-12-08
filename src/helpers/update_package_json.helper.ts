import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import type { IPackage } from '../interfaces/package.interface';

import { error } from './error.helper';

export function updatePackageJson(
  targetDir: string,
  fields: IPackage,
): void {
  const packageJsonPath = path.join(targetDir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    error(`File not found: ${packageJsonPath}`, null);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  // Обновляем только указанные поля
  packageJson.name = fields.name;

  if (fields.version) packageJson.version = fields.version;
  if (fields.productName) packageJson.productName = fields.productName;
  if (fields.description) packageJson.description = fields.description;
  if (fields.repository) packageJson.repository = fields.repository;
  if (fields.author) packageJson.author = fields.author;

  try {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (err) {
    error('Error write package.json', err);
  }
}
