const fs = require('fs-extra');
const path = require('path');

const gitPath = process.env.GIT_PATH;

const removeDir = (username, repoName) => {
  const directory = path.resolve(`${gitPath}/${username}/${repoName}`);
  fs.remove(directory, (err) => {
    if (err) return false;
  });
  return true;
};

module.exports = {
  removeDir
};
