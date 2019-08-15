const path = require('path');
const { gitPath } = require('../config/git.config.js');

const getPathToRepo = (username, reponame) =>
  path.resolve(`${gitPath}/${username}/${reponame}.git`);

const getPathToRepos = username => path.resolve(`${gitPath}/${username}`);

module.exports = {
  getPathToRepo,
  getPathToRepos
};
