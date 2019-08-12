const NodeGit = require('nodegit');
const fs = require('fs-extra');
const path = require('path');

const { readdirSync } = require('fs');

const gitPath = process.env.GIT_PATH;

const createRepo = async ({ owner, repository }) => {
  let result = 'Repo was created';
  const pathToRepo = path.resolve(`${gitPath}/${owner}/${repository}`).replace(/\\/g, '/');
  await NodeGit.Repository.init(pathToRepo, 1)
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

const renameRepo = async ({ repoName, newName, username }) => {
  try {
    const oldDirectory = path.resolve(`${gitPath}/${username}/${repoName}`);
    const newDirectory = path.resolve(`${gitPath}/${username}/${newName}`);
    fs.renameSync(oldDirectory, newDirectory);
    return true;
  } catch (e) {
    return false;
  }
};

const deleteRepo = async ({ repoName, username }) => {
  try {
    const directory = path.resolve(`${gitPath}/${username}/${repoName}`);
    await fs.remove(directory);
    return true;
  } catch (e) {
    return false;
  }
};

const getReposNames = async ({ user, filter: { filterWord, limit } }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}`);
  const repos = readdirSync(pathToRepo, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)
    .filter(name => name.includes(filterWord));
  return limit ? repos.slice(0, limit) : repos;
};

module.exports = {
  createRepo,
  renameRepo,
  deleteRepo,
  getReposNames,
  checkName
};
