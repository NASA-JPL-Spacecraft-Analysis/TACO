import { environment } from 'src/environments/environment';

export interface ConfigState {
  app: {
    baseUrl: string;
  };
}

export const config: ConfigState = {
  app: {
    baseUrl: environment.baseUrl
  }
};
