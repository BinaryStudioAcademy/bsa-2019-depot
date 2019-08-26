import callWebApi from '../helpers/webApiHelper';

export const getBranches = async (owner, repoName) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/branches`,
    type: 'GET'
  });
  return response.json();
};

export const getLastCommit = async (owner, repoName, branch) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${branch}/last-commit`,
    type: 'GET'
  });
  return response.json();
};

export const getFileTree = async (owner, repoName, branch, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${branch}/tree`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getFileContent = async (owner, repoName, branch, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${branch}/file`,
    type: 'GET',
    query
  });
  return response.json();
};
