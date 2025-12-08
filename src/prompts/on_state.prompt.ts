import { error } from '../helpers/error.helper';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function onState(state: any): void {
  if (state.aborted) {
    error('Operation cancelled', null);
  }
}
