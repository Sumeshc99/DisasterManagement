import axios from 'axios';

export const BASE_URL = 'http://192.168.29.49:8085/api/';
export const IMG_URL = 'http://192.168.29.49:8085/';

const getHeader = (isFormData = false) => ({
  'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
  'Access-Control-Allow-Origin': '*',
});

const getAuthHeader = (token: string, isFormData = false) => ({
  'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
  'Access-Control-Allow-Origin': '*',
  Authorization: `Bearer ${token}`,
});

const constructApiRequest = (
  path: string,
  method: string,
  body?: any,
  token?: string,
) => {
  const isFormData = body instanceof FormData;
  const headers = token
    ? getAuthHeader(token, isFormData)
    : getHeader(isFormData);

  return {
    url: path,
    method,
    headers,
    data: body || undefined,
  };
};

const Axios = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

const requests = {
  get: (path: string, token?: string) =>
    Axios(constructApiRequest(path, 'get', '', token)),

  post: (path: string, params?: any, token?: string) =>
    Axios(constructApiRequest(path, 'post', params, token)),

  put: (path: string, params?: any, token?: string) =>
    Axios(constructApiRequest(path, 'put', params, token)),

  delete: (path: string, params?: any, token?: string) =>
    Axios(constructApiRequest(path, 'delete', params, token)),
};

const requestPath = {
  login: 'mobileapis/mobilelogin',
  verifyOtp: 'mobileapis/verifyOtp',
  resendOtp: 'mobileapis/resendOtp',
  verifyPin: 'mobileapis/verifyPin',
  forgetPin: 'mobileapis/forgotPin',
  resetPin: 'mobileapis/resetPin',
  responderList: 'responder/public/list',
  incidentList: 'incidents/public/list',
  shortProfile: 'mobileapis/shortProfile',
};

const ApiManager = {
  // Public API
  responderList: () => requests.get(requestPath.responderList),

  // Auth APIs
  userLogin: (params: any) => requests.post(requestPath.login, params),
  verifyOtp: (params: any) => requests.post(requestPath.verifyOtp, params),
  resendOtp: (params: any) => requests.post(requestPath.resendOtp, params),
  verifyPin: (params: any) => requests.post(requestPath.verifyPin, params),
  forgetPin: (params: any) => requests.post(requestPath.forgetPin, params),
  resetPin: (params: any) => requests.post(requestPath.resetPin, params),

  // Authenticated (requires Bearer token)
  shortProfile: (params: any, token: string) =>
    requests.post(requestPath.shortProfile, params, token),
};

export default ApiManager;
