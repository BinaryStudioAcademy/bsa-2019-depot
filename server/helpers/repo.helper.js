const fs = require('fs-extra');
const path = require('path');

const gitPath = process.env.GIT_PATH;

const removeDir = (username, repoName) => {
  try {
    const directory = path.resolve(`${gitPath}/${username}/${repoName}`);
    fs.remove(directory, err => err);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  removeDir
};
