import { config, ConfigState } from '../config';

const initialState: ConfigState = config;

export function reducer(
  state: ConfigState = initialState
): ConfigState {
  return state;
}
