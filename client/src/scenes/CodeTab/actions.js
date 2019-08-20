import { NEW_FILE } from './actionTypes';

export const newFile = ({ filename, content }) => ({
  type: NEW_FILE,
  payload: {
    filename,
    content
  }
});
