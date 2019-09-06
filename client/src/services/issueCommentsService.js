import callWebApi from '../helpers/webApiHelper';

export const createIssueComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/issue-comments',
    type: 'POST',
    request
  });
  return response ? response.json() : false;
};

export const updateIssueComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/issue-comments',
    type: 'PUT',
    request
  });
  return response ? response.json() : false;
};

export const deleteIssueComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/issue-comments/${id}`,
    type: 'DELETE'
  });

  return response.status === 204 ? true : false;
};
