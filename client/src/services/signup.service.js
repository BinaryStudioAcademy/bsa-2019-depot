import callWebApi from '../helpers/webApiHelper';

const serverURL = process.env.REACT_APP_SERVER_URL;

export const signup = async request => {
    const response = await callWebApi({
        endpoint: serverURL + '/auth/register',
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
