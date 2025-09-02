const url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

export const environment = {
  baseUrl: url + '/taco/api/v1',
  camServerUrl: undefined,
  production: false,
  editGroups: undefined,
  ssoTokenName: undefined
};
