import callWebApi from '../helpers/webApiHelper';
import { MOBILE_SERVER } from 'react-native-dotenv';

export const getAllStars = async username => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users/${username}/stars`,
    type: 'GET'
  });
  return response.json();
};
