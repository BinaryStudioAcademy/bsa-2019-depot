import callWebApi from '../helpers/webApiHelper';
import { MOBILE_SERVER } from 'react-native-dotenv';

export const getAllIssues = async (username, params) => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/users/${username}/issues`,
    type: 'GET',
    query: params
  });
  return response.json();
};

export const getIssueComments = async issueId => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/issues/${issueId}/comments`,
    type: 'GET'
  });
  return response.json();
};

export const createIssueComment = async request => {
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/issue-comments`,
    type: 'POST',
    request
  });
  return response ? response.json() : false;
};

export const closeIssue = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/issues/${id}/close`,
    type: 'PUT'
  });
  return response.json();
};

export const reopenIssue = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `${MOBILE_SERVER}/api/issues/${id}/reopen`,
    type: 'PUT'
  });
  return response.json();
};
