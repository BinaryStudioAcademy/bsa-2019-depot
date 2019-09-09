import callWebApi from '../helpers/webApiHelper';

export const getLabels = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/labels`,
    type: 'GET'
  });
  return response.json();
};

export const createLabel = async request => {
  const response = await callWebApi({
    endpoint: '/api/labels',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateLabel = async request => {
  const response = await callWebApi({
    endpoint: '/api/labels',
    type: 'PUT',
    request
  });
  return response.json();
};

export const deleteLabel = async labelId => {
  const response = await callWebApi({
    endpoint: `/api/labels/${labelId}`,
    type: 'DELETE'
  });
  return response.json();
};

export const setLabelsToIssue = async (labelIds, issueId) => {
  const response = await callWebApi({
    endpoint: '/api/issue-labels',
    type: 'POST',
    request: {
      labelIds,
      issueId
    }
  });
  return response.json();
};

export const setLabelsToPull = async (labelIds, pullId, repositoryId) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/pulls/labels`,
    type: 'POST',
    request: {
      labelIds,
      pullId
    }
  });
  return response.json();
};
