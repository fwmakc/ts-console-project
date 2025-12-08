import prompts from 'prompts';

import { onState } from './on_state.prompt';

export async function multiselect(
  message: string,
  options: string[],
  selected: boolean = false,
): Promise<string[]> {
  const choices = options.map(i => ({
    title: i,
    value: i.trim().toLowerCase(),
    selected,
  }));

  const response = await prompts({
    type: 'multiselect',
    name: 'value',
    message,
    choices,
    instructions: false,
    onState,
  });

  return response.value;
}
