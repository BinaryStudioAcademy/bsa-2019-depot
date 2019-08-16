const path = require('path');
const { gitPath } = require('../config/git.config.js');

const getPathToRepo = (username, reponame) => path.resolve(`${gitPath}/${username}/${reponame}.git`).replace(/\\/g, '/');
const getPathToRepos = username => path.resolve(`${gitPath}/${username}`).replace(/\\/g, '/');

module.exports = {
  getPathToRepo,
  getPathToRepos
};
