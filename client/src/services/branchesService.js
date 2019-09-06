import callWebApi from '../helpers/webApiHelper';

export const getBranches = async repoID => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoID}/branches`,
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

export const getBranch = async (repoID, branch) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoID}/branches/${branch}`,
    type: 'GET'
  });
  return response.json();
};

export const checkFilename = async (owner, repoName, branch, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${branch}/file-exist`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getFileBlame = async (owner, repoName, branch, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${branch}/blame`,
    type: 'GET',
    query
  });
  return response.json();
};
