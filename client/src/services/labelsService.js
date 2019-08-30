import callWebApi from '../helpers/webApiHelper';

export const getLabels = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repo/${repositoryId}/labels`,
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
