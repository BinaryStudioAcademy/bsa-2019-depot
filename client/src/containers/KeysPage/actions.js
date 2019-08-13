import { ADD_SSH_KEY, SSH_KEY_ADDED, DELETE_SSH_KEY, SSH_KEY_DELETED } from './actionTypes';

export const addSshKey = ({ title, value }) => ({
  type: ADD_SSH_KEY,
  payload: {
    title,
    value
  }
});

export const deleteSshKey = id => ({
  type: DELETE_SSH_KEY,
  payload: {
    id
  }
});

export const sshKeyAdded = () => ({
  type: SSH_KEY_ADDED
});

export const sshKeyDeleted = () => ({
  type: SSH_KEY_DELETED
});
