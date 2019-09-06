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

export const setLabelToPull = async (labelId, pullId, repositoryId) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/pulls/labels`,
    type: 'POST',
    request: {
      labelId,
      pullId
    }
  });
  return response.json();
};

export const removeLabelFromPull = async (labelId, repositoryId) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/pulls/labels`,
    type: 'DELETE',
    request: {
      labelId
    }
  });
  return response.json();
};
