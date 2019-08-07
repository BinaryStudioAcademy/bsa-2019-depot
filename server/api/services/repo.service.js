const NodeGit = require('nodegit');
const { gitpath } = require('../../config/git.config');

const createRepo = async ({ user, name }) => {
  let result = 'Repo was created';
  const pathToRepo = require('path').resolve(`../${gitpath}/${user}/${name}`);
  await NodeGit.Repository.init(pathToRepo, 1)
    .then(repo => {})
    .catch(reasonForFailure => {
      result = 'Error! Repos wasn`t created';
    });
  return result;
};

module.exports = { createRepo };
