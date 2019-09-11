import callWebApi from '../helpers/webApiHelper';
import { MOBILE_SERVER } from 'react-native-dotenv';

export const getUserPulls = async (username, params) => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users/${username}/pulls`,
    type: 'GET',
    query: params
  });
  return response.json();
};

export const getPullComments = async pullId => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/pulls/${pullId}/comments`,
    type: 'GET'
  });
  return response.json();
};

export const createPullComment = async request => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/pull-comments`,
    type: 'POST',
    request
  });
  return response.json();
};

export const mergePull = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/pulls/${id}/merge`,
    type: 'PUT'
  });
  return response.json();
};

export const closePull = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/pulls/${id}/close`,
    type: 'PUT'
  });
  return response.json();
};

export const reopenPull = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/pulls/${id}/reopen`,
    type: 'PUT'
  });
  return response.json();
};
