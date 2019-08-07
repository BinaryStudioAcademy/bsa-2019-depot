import callWebApi from '../helpers/webApiHelper';

export const login = async request => {
    const response = await callWebApi({
        endpoint: '/auth/login',
        type: 'POST',
        request
    });
    return response.json();
};
