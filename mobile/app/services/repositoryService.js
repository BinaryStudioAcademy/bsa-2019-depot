import callWebApi from '../helpers/webApiHelper';
import { MOBILE_SERVER } from 'react-native-dotenv';

export const getRepositories = async owner => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users/${owner}/repos`,
    type: 'GET'
  });
  return response.json();
};
