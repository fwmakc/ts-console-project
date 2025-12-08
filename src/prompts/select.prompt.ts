import prompts from 'prompts';

import { onState } from './on_state.prompt';

export async function select(
  message: string,
  options: string[],
): Promise<string> {
  const choices = options.map(i => ({
    title: i,
    value: i.trim().toLowerCase(),
  }));

  const response = await prompts({
    type: 'select',
    name: 'value',
    message,
    choices,
    initial: 0,
    onState,
  });

  return response.value;
}
