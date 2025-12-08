import { execSync } from 'child_process';

export function detectPackageManagers(): string[] {
  const packageManagers = ['npm'];

  try {
    execSync('yarn --version', { stdio: 'ignore' });
    packageManagers.unshift('yarn');
    // eslint-disable-next-line no-empty
  } catch (_err) {}

  return packageManagers;
}
