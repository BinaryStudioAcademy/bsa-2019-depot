const NodeGit = require('nodegit');
const fs = require('fs-extra');
const fse = require('fs-extra');
const path = require('path');

const repoRepository = require('../../data/repositories/repository.repository');

const gitPath = process.env.GIT_PATH;

const createRepo = async ({ owner, name, userId }) => {
  let result = 'Repo was created';
  const pathToRepo = path.resolve(`${gitPath}/${owner}/${name}`).replace(/\\/g, '/');
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
  const filePath = path.resolve(`${gitPath}/${owner}/${reponame}`);
  const exists = await fs.existsSync(filePath);
  return exists;
};

const isEmpty = async ({ owner, reponame }) => {
  try {
    let result;
    const pathToRepo = path.resolve(`${gitPath}/${owner}/${reponame}`);
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

const getReposNames = async ({ user, filter, limit }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}`);
  const doesDirExists = fs.existsSync(pathToRepo);
  if (doesDirExists) {
    const repos = fs
      .readdirSync(pathToRepo, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name);
    const filteredRepos = filter ? repos.filter(repo => repo.includes(filter)) : repos;
    return limit ? filteredRepos.slice(0, limit) : repos;
  }
  return [];
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
  checkName,
  isEmpty,
  forkRepo
};
