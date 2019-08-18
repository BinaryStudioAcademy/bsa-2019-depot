const NodeGit = require('nodegit');
const fs = require('fs-extra');
const fse = require('fs-extra');

const repoHelper = require('../../helpers/repo.helper');
const repoRepository = require('../../data/repositories/repository.repository');

const createRepo = async ({ owner, name, userId }) => {
  let result = 'Repo was created';
  const pathToRepo = repoHelper.getPathToRepo(owner, name);
  await NodeGit.Repository.init(pathToRepo, 1)
    .then(() => {
      result = {
        msg: 'Repo created',
        url: pathToRepo
      };
    })
    .catch(() => {
      result = 'Error! Repos wasn`t created';
    });

  repoRepository.create({
    userId,
    name
  });
  return result;
};

const checkName = async ({ owner, reponame }) => {
  const filePath = repoHelper.getPathToRepo(owner, reponame);
  const exists = await fs.existsSync(filePath);
  return exists;
};

const isEmpty = async ({ owner, reponame }) => {
  try {
    let result;
    const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
    await NodeGit.Repository.open(pathToRepo).then((repo) => {
      result = repo.isEmpty();
    });
    return {
      isEmpty: Boolean(result),
      url: pathToRepo
    };
  } catch (e) {
    console.warn(e);
    return e;
  }
};

const renameRepo = async ({ repoName, newName, username }) => {
  try {
    const oldDirectory = repoHelper.getPathToRepo(username, repoName);
    const newDirectory = repoHelper.getPathToRepo(username, newName);
    fs.renameSync(oldDirectory, newDirectory);
    return true;
  } catch (e) {
    return false;
  }
};

const deleteRepo = async ({ repoName, username }) => {
  try {
    const directory = repoHelper.getPathToRepo(username, repoName);
    await fs.remove(directory);
    return true;
  } catch (e) {
    return false;
  }
};

const getReposNames = async ({ user, filter, limit }) => {
  const pathToRepo = repoHelper.getPathToRepos(user);
  const doesDirExists = fs.existsSync(pathToRepo);
  if (doesDirExists) {
    const repos = fs
      .readdirSync(pathToRepo, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name.slice(0, -4));
    const filteredRepos = filter ? repos.filter(repo => repo.includes(filter)) : repos;
    return limit ? filteredRepos.slice(0, limit) : repos;
  }
  return [];
};

const getReposData = async ({ username }) => repoRepository.getByUsername(username);

const forkRepo = async ({ username, owner, repoName }) => {
  try {
    const source = repoHelper.getPathToRepo(owner, repoName);
    const target = repoHelper.getPathToRepo(username, repoName);

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
  checkName,
  isEmpty,
  forkRepo,
  getReposData
};
