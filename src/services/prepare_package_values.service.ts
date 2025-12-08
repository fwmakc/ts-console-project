import { defaults } from '../consts/defaults.const';
import type { IPackage } from '../interfaces/package.interface';
import { confirm } from '../prompts/confirm.prompt';
import { list } from '../prompts/list.prompt';
import { question } from '../prompts/question.prompt';

export async function preparePackageValues(args: string[]): Promise<IPackage> {
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

  if (args.length) {
    productName = args
      .map(i => `${i.slice(0, 1).toUpperCase()}${i.slice(1)}`)
      .join(' ');

    name = args.map(i => i.toLowerCase()).join('-');
  } else {
    productName = (
      await question('Product name (required)', productName, true)
    ).trim();

    name = productName
      .split(' ')
      .map(i => i.toLowerCase())
      .join('-');

    name = (await question('Project (required)', name, true)).trim();
  }

  const extended = await confirm('Config extended project params?', true);

  if (extended) {
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
      repository.url = `git+${url}`;

      bugs = {};
      if (author.email) {
        bugs.email = author.email;
      }
      bugs.url = `${url}/issues`;

      homepage = `${url}#readme`;
    }
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
