import callWebApi from '../helpers/webApiHelper';
import { MOBILE_SERVER } from 'react-native-dotenv';

export const checkUsernameExists = async username => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users/username-exists?username=${username}`,
    type: 'GET'
  });
  return response.json();
};

export const getUserDetailed = async username => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users/${username}/overview`,
    type: 'GET'
  });
  return response.json();
};

export const updateUserDeviceToken = async request => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users`,
    type: 'PUT',
    request
  });
  return response.json();
};
