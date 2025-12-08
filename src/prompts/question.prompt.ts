import prompts from 'prompts';

import { onState } from './on_state.prompt';

export async function question(
  message: string,
  initial: string = '',
  required: boolean = false,
): Promise<string> {
  const validate = (value: string): boolean => {
    if (!required) {
      return true;
    }
    if (required && value.trim()) {
      return true;
    }
    return false;
  };

  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
    initial,
    validate,
    onState,
  });

  return response.value || '';
}
