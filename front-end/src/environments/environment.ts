const url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

export const environment = {
  // baseUrl: url + '/taco/api/v1',
  // baseUrl: url + '/taco',
  baseUrl: 'http://localhost:3000',
  camServerUrl: undefined,
  production: false,
  editGroups: undefined,
  ssoTokenName: undefined
};
