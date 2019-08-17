const path = require('path');
const fs = require('fs');
const { gitPath } = require('../config/git.config.js');

const getPathToRepo = (username, reponame) => path.resolve(`${gitPath}/${username}/${reponame}.git`).replace(/\\/g, '/');
const getPathToRepos = username => path.resolve(`${gitPath}/${username}`).replace(/\\/g, '/');

const createReadme = (username, reponame) => {
  const pathToReadme = `${getPathToRepo(username, reponame)}/README.md`;
  fs.writeFileSync(pathToReadme, `# ${reponame}`);
};

module.exports = {
  getPathToRepo,
  getPathToRepos,
  createReadme
};
