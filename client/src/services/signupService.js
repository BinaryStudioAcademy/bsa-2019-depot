import callWebApi from '../helpers/webApiHelper';

export const signup = async request => {
    const response = await callWebApi({
        endpoint: '/auth/register',
        type: 'POST',
        request
    });
    return response.json();
};

export const googleSignup = async () => {
    const response = await callWebApi({
        endpoint: '/auth/google',
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
    debugger;
    const response = await callWebApi({
        endpoint: '/user/username',
        type: 'POST',
        request
    });
    return response.json();
};

export const checkUsername = async username => {
    const response = await callWebApi({
        endpoint: '/user/username-exists',
        type: 'GET',
        query: {
            username
        }
    });
    return response.json();
};
