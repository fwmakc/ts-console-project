import prompts from 'prompts';

import { onState } from './on_state.prompt';

export async function confirm(
  message: string,
  initial: boolean,
): Promise<string> {
  const response = await prompts({
    type: 'toggle',
    name: 'value',
    message,
    initial,
    active: 'yes',
    inactive: 'no',
    onState,
  });

  return response.value;
}
