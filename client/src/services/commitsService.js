import callWebApi from '../helpers/webApiHelper';

export const getCommits = async (owner, repoName, branch) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/${branch}/commits`,
    type: 'GET'
  });
  return response.json();
};

export const getAllUserCommits = async owner => {
  const response = await callWebApi({
    endpoint: `/api/commit/${owner}/commits`,
    type: 'GET'
  });
  return response.json();
};
