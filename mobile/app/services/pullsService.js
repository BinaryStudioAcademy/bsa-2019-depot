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
