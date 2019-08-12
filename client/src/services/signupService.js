import callWebApi from '../helpers/webApiHelper';

export const signup = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/register',
    type: 'POST',
    request
  });
  return response.json();
};

export const setToken = token => {
  localStorage.setItem('token', token);
};

// export const getCurrentUser = async () => {
//     try {
//         const response = await callWebApi({
//             endpoint: '/api/auth/user',
//             type: 'GET'
//         });
//         return response.json();
//     } catch (e) {
//         return null;
//     }
// };
