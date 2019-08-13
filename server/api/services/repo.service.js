const NodeGit = require('nodegit');
const fs = require('fs-extra');
const fse = require('fs-extra');
const path = require('path');

const { readdirSync } = require('fs');

const gitPath = process.env.GIT_PATH;

const createRepo = async ({ user, name }) => {
  let result = 'Repo was created';
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
  await NodeGit.Repository.init(pathToRepo.replace(/\\/g, '/'), 1).catch(() => {
    result = 'Error! Repos wasn`t created';
  });
  return result;
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

const forkRepo = async ({ username, owner, repoName }) => {
  try {
    const source = path.resolve(`${gitPath}/${owner}/${repoName}`);
    const target = path.resolve(`${gitPath}/${username}/${repoName}`);

    if (!fs.existsSync(source)) {
      return { status: false, error: 'repo to copy doesn`t exist' };
    }

    if (fs.existsSync(target)) {
      return { status: false, error: 'such repo already exists' };
    }

    fs.mkdirSync(target);
    return await fse
      .copy(source, target, { preserveTimestamps: true })
      .then(() => ({ status: true, path: target }))
      .catch(err => ({ status: false, error: err.message }));
  } catch (err) {
    return { status: false, error: err.message };
  }
};

module.exports = {
  createRepo,
  renameRepo,
  deleteRepo,
  getReposNames,
  forkRepo
};
