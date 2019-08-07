import callWebApi from '../helpers/webApiHelper';

const serverURL = 'http://localhost:3000';

export const signup = async request => {
    const response = await callWebApi({
        endpoint: serverURL + '/auth/register',
        type: 'POST',
        request
    });
    return response.json();
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
