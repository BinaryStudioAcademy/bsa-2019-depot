const fs = require('fs-extra');
const path = require('path');

const gitPath = process.env.GIT_PATH;

const removeDir = async (username, repoName) => {
  try {
    const directory = path.resolve(`${gitPath}/${username}/${repoName}`);
    await fs.remove(directory);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  removeDir
};
