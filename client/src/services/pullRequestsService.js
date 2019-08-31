import callWebApi from '../helpers/webApiHelper';

export const getBranchDiffs = async (repoId, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoId}/pull-requests/diffs`,
    type: 'GET',
    query
  });
  return response.json();
};
