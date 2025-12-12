import { defaults } from '../consts/defaults.const';
import type { IPackage } from '../interfaces/package.interface';
import { list } from '../prompts/list.prompt';
import { question } from '../prompts/question.prompt';

export async function valuesPackage(packageJson?: IPackage): Promise<IPackage> {
  let {
    name,
    productName,
    description,
    version,
    author,
    repository,
    bugs,
    homepage,
  } = packageJson || defaults;

  productName = (
    await question('Title / product name (required)', productName, true)
  ).trim();

  name = name || productName.toLowerCase().replace(/[\W_]+/giu, '-');
  name = (await question('Project / name (required)', name, true)).trim();
  name = name.replaceAll(' ', '').replace(/[^\w._-]+/giu, '-');

  description = (
    await question('Description (required)', description, true)
  ).trim();

  const userInputVersion = await list('Version', version);

  for (let i = userInputVersion.length; i < 3; i++) {
    userInputVersion.push('0');
  }

  version = userInputVersion.join('.');

  author = typeof author === 'object' ? author : {};

  author.name = (
    await question('Author / vendor / git (required)', author.name || '', true)
  ).trim();
  author.email = (
    await question('Email (required)', author.email || '', true)
  ).trim();

  repository = typeof repository === 'object' ? repository : {};

  const repoAuthor = author.name
    .replaceAll(' ', '')
    .replace(/[^\w._-]+/giu, '-');
  const defaultInputUrl = `https://github.com/${repoAuthor}/${name}.git`;
  const url = (
    await question('Repository url', repository.url || defaultInputUrl)
  ).trim();

  if (url) {
    repository.type = 'git';
    repository.url = `git+${url}`;

    bugs = typeof bugs === 'object' ? bugs : {};
    if (author.email) {
      bugs.email = bugs.email || author.email;
    }
    bugs.url = bugs.url || `${url}/issues`;

    homepage = homepage || `${url}#readme`;
  }

  const packageValues: IPackage = {
    name,
    productName,
    description,
    version,
    author,
    repository,
    bugs,
    homepage,
  };

  return packageValues;
}
