import callWebApi from '../helpers/webApiHelper';

export const getAllStars = async username => {
  const response = await callWebApi({
    endpoint: `http://10.0.2.2:3000/api/users/${username}/stars`,
    type: 'GET'
  });
  return response.json();
};
