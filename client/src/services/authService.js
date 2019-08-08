import callWebApi from '../helpers/webApiHelper';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const login = async request => {
    const response = await callWebApi({
        endpoint: `${serverUrl}/auth/login`,
        type: 'POST',
        request
    });
    return response;
};

export const getCurrentUser = async () => {
    const response = await callWebApi({
        endpoint: '/api/auth/user',
        type: 'GET'
    });
    return response.json();
};
