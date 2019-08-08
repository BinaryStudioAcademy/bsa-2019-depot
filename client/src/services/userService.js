import callWebApi from '../helpers/webApiHelper';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const forgot = async request => {
  const response = await callWebApi({
    endpoint: serverUrl + '/user/forget-password',
    type: 'POST',
    request
  });
  return response.json();
};

export const reset = async request => {
  const response = await callWebApi({
    endpoint: serverUrl + '/user/reset-password',
    type: 'POST',
    request
  });
  return response.json();
};
