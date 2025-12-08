import prompts from 'prompts';

import { onState } from './on_state.prompt';

export async function list(
  message: string,
  initial: string = '',
): Promise<string[]> {
  const response = await prompts({
    type: 'list',
    name: 'value',
    message,
    initial,
    separator: '.',
    onState,
  });

  return response.value || '';
}
