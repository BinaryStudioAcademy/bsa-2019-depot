const NodeGit = require('nodegit');
const path = require('path');
const fs = require('fs');

const gitPath = process.env.GIT_PATH;

const createRepo = async ({ owner, repository }) => {
  let result = 'Repo was created';
  const pathToRepo = path.resolve(`${gitPath}/${owner}/${repository}`);
  await NodeGit.Repository.init(pathToRepo.replace(/\\/g, '/'), 1)
    .then(() => {
      result = {
        url: pathToRepo
      };
    })
    .catch(() => {
      result = 'Error! Repos wasn`t created';
    });
  return result;
};

const checkName = async ({ user, name }) => {
  const filePath = path.resolve(`${gitPath}/${user}/${name}`);
  const exists = await fs.existsSync(filePath);
  return exists;
};

const { readdirSync } = fs;
const getReposNames = async ({ user, filter: { filterWord, limit } }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}`);
  const repos = readdirSync(pathToRepo, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)
    .filter(name => name.includes(filterWord));
  return limit ? repos.slice(0, limit) : repos;
};

module.exports = { createRepo, getReposNames, checkName };
