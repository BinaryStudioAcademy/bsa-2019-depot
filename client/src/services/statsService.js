import callWebApi from '../helpers/webApiHelper';

export const getLanguageStats = async (repoId, branch) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoId}/branches/${branch}/stats`,
    type: 'GET'
  });
  return response.json();
};
