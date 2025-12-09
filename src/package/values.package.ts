import { defaults } from '../consts/defaults.const';
import type { IPackage } from '../interfaces/package.interface';
import { list } from '../prompts/list.prompt';
import { question } from '../prompts/question.prompt';

export async function valuesPackage(): Promise<IPackage> {
  let {
    name,
    productName,
    description,
    version,
    author,
    repository,
    bugs,
    homepage,
  } = defaults;

  productName = (
    await question('Product name (required)', productName, true)
  ).trim();

  name = productName
    .split(' ')
    .map(i => i.toLowerCase())
    .join('-');

  name = (await question('Project (required)', name, true)).trim();

  description = (
    await question('Description (required)', description, true)
  ).trim();

  const userInputVersion = await list('Version', version);

  for (let i = userInputVersion.length; i < 3; i++) {
    userInputVersion.push('0');
  }

  version = userInputVersion.join('.');

  author = {};

  author.name = (await question('Author (required)', '', true)).trim();
  author.email = (await question('Email (required)', '', true)).trim();

  repository = {};

  const defaultInputUrl = `https://github.com/${author.name}/${name}.git`;
  const url = (await question('Repository url', defaultInputUrl)).trim();

  if (url) {
    repository.type = 'git';
    repository.url = `git+${url}`;

    bugs = {};
    if (author.email) {
      bugs.email = author.email;
    }
    bugs.url = `${url}/issues`;

    homepage = `${url}#readme`;
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
