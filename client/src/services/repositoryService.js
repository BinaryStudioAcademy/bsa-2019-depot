import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async (owner, filter) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/repos`,
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const forkRepo = async ({ owner, repo }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repo}`,
    type: 'POST'
  });
  return response.json();
};
