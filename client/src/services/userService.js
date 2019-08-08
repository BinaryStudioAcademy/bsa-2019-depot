import callWebApi from '../helpers/webApiHelper';

export const getUser = async id => {
    const request = { id };

    const response = await callWebApi({
        endpoint: '/user/',
        type: 'GET',
        request
    });

    return response.json();
};
