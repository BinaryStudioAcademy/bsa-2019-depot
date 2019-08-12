import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async (owner, filter) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/repos`,
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const createRepository = async request => {
  const response = await callWebApi({
    endpoint: '/api/repo',
    type: 'POST',
    request
  });
  return response.json();
};

export const checkName = async ({ owner, repository }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repository}/check-name`,
    type: 'GET'
  });
  return response.json();
};
