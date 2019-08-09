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

export const googleSignup = async () => {
    const response = await callWebApi({
        endpoint: serverURL + '/auth/google',
        type: 'GET'
    });
    return response.json();
};

export const setToken = token => {
    localStorage.setItem('token', token);
};

export const setUsername = async (username, profile) => {
    const request = {
        username,
        profile
    };
    const response = await callWebApi({
        endpoint: serverURL + '/user/username',
        type: 'POST',
        request
    });
    return response.json();
};

export const checkUsername = async username => {
    const response = await callWebApi({
        endpoint: serverURL + '/user/username-exists',
        type: 'GET',
        query: {
            username
        }
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
