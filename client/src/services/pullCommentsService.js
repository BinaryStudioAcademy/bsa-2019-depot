import callWebApi from '../helpers/webApiHelper';

export const createPullComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/pull-comments',
    type: 'POST',
    request
  });
  return response ? response.json() : false;
};

export const updatePullComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/pull-comments',
    type: 'PUT',
    request
  });
  return response ? response.json() : false;
};

export const deletePullComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/pull-comments/${id}`,
    type: 'DELETE'
  });

  return response.status === 200;
};
