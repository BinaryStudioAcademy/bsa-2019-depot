import callWebApi from '../helpers/webApiHelper';

export const forgot = async request => {
    const response = await callWebApi({
        endpoint: '/user/forget-password',
        type: 'POST',
        request
    });
    return response.json();
};

export const reset = async request => {
    const response = await callWebApi({
        endpoint: '/user/reset-password',
        type: 'POST',
        request
    });
    return response.json();
};
