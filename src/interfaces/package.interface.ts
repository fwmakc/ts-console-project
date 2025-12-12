import type { IPackageAuthor } from './package_author.interface';
import type { IPackageBugs } from './package_bugs.interface';
import type { IPackageRepository } from './package_repository.interface';

interface ILibrariesParams {
  [key: string]: string;
}

export interface IPackage {
  name: string;
  version: string;
  productName: string;
  description: string;
  license: string;
  keywords: string[];
  author: IPackageAuthor | string;
  repository: IPackageRepository | string;
  bugs: IPackageBugs | string;
  homepage: string;
  main: string;
  types: string;

  scripts: ILibrariesParams;
  devDependencies: ILibrariesParams;
  dependencies: ILibrariesParams;
}
