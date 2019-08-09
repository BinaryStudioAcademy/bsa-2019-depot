const NodeGit = require('nodegit');
const path = require('path');
const { readdirSync } = require('fs')

const gitPath = process.env.GIT_PATH;

const createRepo = async ({ user, name }) => {
  let result = 'Repo was created';
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
  await NodeGit.Repository.init(pathToRepo.replace(/\\/g, '/'), 1)
    .then(repo => {})
    .catch(reasonForFailure => {
      result = 'Error! Repos wasn`t created';
    });
  return result;
};

const getReposNames = async ({ user, filter: {filterWord, limit} }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}`);
  const repos =  readdirSync(pathToRepo, { withFileTypes: true })
  .filter(dir => dir.isDirectory())
  .map(dir => dir.name)
  .filter(name => name.includes(filterWord));
  return repos.slice(0, limit);
};

module.exports = { createRepo, getReposNames };
