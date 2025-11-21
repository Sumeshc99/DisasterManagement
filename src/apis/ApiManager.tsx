import axios from 'axios';

export const BASE_URL = 'https://disaster.pixelplanet.in/api/';
export const IMG_URL = 'https://disaster.pixelplanet.in/';

// export const BASE_URL = 'https://disasterqaapi.civicplan.in/api/';
// export const IMG_URL = 'https://disasterqaapi.civicplan.in/';

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
  language: 'mobileapis/getLanguage',
  login: 'mobileapis/mobilelogin',
  verifyOtp: 'mobileapis/verifyOtp',
  resendOtp: 'mobileapis/resendOtp',
  verifyPin: 'mobileapis/verifyPin',
  forgetPin: 'mobileapis/forgotPin',
  resetPin: 'mobileapis/resetPin',
  responderList: 'responder/public/list',
  incidentList: 'incidents/public/list',
  shortProfile: 'mobileapis/shortProfile',
  tahsilList: 'location/public/cascading-locations',
  getUser: 'mobileapis/getUser',
  updateUser: 'mobileapis/updateProfile',
  changePin: 'mobileapis/changePin',
  createIncident: 'mobileapis/createIncident',
  incidentType: 'field-config/public/list',
  incidentDetails: 'mobileapis/getIncidentById',
  incidentSend: 'mobileapis/updateIncidentStatus',
  incidentStatusUpdate: 'mobileapis/updateIncidentStatus',
  updateIncident: 'mobileapis/updateIncident',
  getIncidentDta: 'mobileapis/getUserId',
  assignedIncident: 'mobileapis/getReviewerAssignedIncident',
  acceptIncident: 'mobileapis/assignedIncidentAccept',
  getIncidentIds: 'mobileapis/getIncidentIds',
  assignResponders: 'mobileapis/assignedIncidentResponder',
  assignedToResponder: 'mobileapis/getResponderAssignedIncident',
  assignToReviewer: 'mobileapis/assignedIncident',
};

const ApiManager = {
  // Public API (get, no token required)
  language: () => requests.get(requestPath.language),
  tahsilList: () => requests.get(requestPath.tahsilList),
  responderList: () => requests.get(requestPath.responderList),

  userLogin: (params: any) => requests.post(requestPath.login, params),
  verifyOtp: (params: any) => requests.post(requestPath.verifyOtp, params),
  resendOtp: (params: any) => requests.post(requestPath.resendOtp, params),

  // Authenticated get apis (requires Bearer token)
  incidentList: (token: string) =>
    requests.get(requestPath.incidentList, token),
  getUser: (id: any, token: string) =>
    requests.get(`${requestPath.getUser}/${id}`, token),
  incidentDetails: (id: any, token: string) =>
    requests.get(`${requestPath.incidentDetails}/${id}`, token),
  incidentType: (token: string) =>
    requests.get(requestPath.incidentType, token),
  getIncidentDta: (id: any, token: string) =>
    requests.get(`${requestPath.getIncidentDta}/${id}`, token),
  assignedIncident: (id: any, token: string) =>
    requests.get(`${requestPath.assignedIncident}/${id}`, token),
  acceptIncident: (id: any, userId: number, token: string) =>
    requests.get(`${requestPath.acceptIncident}/${id}/${userId}`, token),
  getIncidentIds: (token: string) =>
    requests.get(`${requestPath.getIncidentIds}`, token),
  assignedToResponder: (id: any, token: string) =>
    requests.get(`${requestPath.assignedToResponder}/${id}`, token),
  assignToReviewer: (id: any, token: string) =>
    requests.get(`${requestPath.assignToReviewer}/${id}`, token),

  // Authenticated (requires Bearer token)
  verifyPin: (params: any, token: string) =>
    requests.post(requestPath.verifyPin, params, token),
  resetPin: (params: any, token: string) =>
    requests.post(requestPath.resetPin, params, token),
  forgetPin: (params: any, token: string) =>
    requests.post(requestPath.forgetPin, params, token),
  shortProfile: (params: any, token: string) =>
    requests.post(requestPath.shortProfile, params, token),
  updateUser: (params: any, token: string) =>
    requests.post(requestPath.updateUser, params, token),
  changePin: (params: any, token: string) =>
    requests.post(requestPath.changePin, params, token),
  createIncident: (params: any, token: string) =>
    requests.post(requestPath.createIncident, params, token),
  incidentSend: (params: any, token: string) =>
    requests.post(requestPath.incidentSend, params, token),
  incidentStatusUpdate: (params: any, token: string) =>
    requests.post(requestPath.incidentStatusUpdate, params, token),
  updateIncident: (params: any, token: string) =>
    requests.post(requestPath.updateIncident, params, token),
  assignResponders: (params: any, token: string) =>
    requests.post(requestPath.assignResponders, params, token),
};

export default ApiManager;
