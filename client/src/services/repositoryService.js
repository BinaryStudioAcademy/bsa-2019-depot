import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async owner => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/repos`,
        type: 'GET'
    });
    return response.json();
};
