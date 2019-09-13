import callWebApi from '../helpers/webApiHelper';

export const addReviewer = async request => {
  const response = await callWebApi({
    endpoint: '/api/pull-reviewers',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateReviewStatus = async request => {
  const response = await callWebApi({
    endpoint: '/api/pull-reviewers',
    type: 'PUT',
    request
  });
  return response.json();
};

export const removeReviewer = async id => {
  const response = await callWebApi({
    endpoint: `/api/pull-reviewers/${id}`,
    type: 'DELETE'
  });

  return response.status === 200;
};

export const getAvailableReviewers = async (repositoryId, pullAuthorId) => {
  const response = await callWebApi({
    endpoint: `/api/pull-reviewers/available/${repositoryId}/${pullAuthorId}`,
    type: 'GET'
  });
  return response.json();
};
