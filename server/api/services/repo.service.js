const NodeGit = require('nodegit');
const fs = require('fs-extra');
const fse = require('fs-extra');

const repoHelper = require('../../helpers/repo.helper');
const repoRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const { initialCommit } = require('./commit.service');
const starRepository = require('../../data/repositories/star.repository');

const createRepo = async ({
  owner, name, userId, initialData
}) => {
  let result = 'Repo was created';
  const pathToRepo = repoHelper.getPathToRepo(owner, name);
  await NodeGit.Repository.init(pathToRepo, 1)
    .then(() => {
      result = {
        msg: 'Repo created',
        url: pathToRepo
      };
    })
    .catch(() => Promise.reject({ status: 404, message: 'Error! Repos wasn`t created' }));

  // Initial data has to contain 'email' (of user) and 'files' in form of [ { filename, content }, {... ]
  if (initialData) {
    await initialCommit({ owner, repoName: name, ...initialData });
  }

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

const getByUserAndReponame = async ({ owner, reponame }) => {
  const { id } = await userRepository.getByUsername(owner);
  return repoRepository.getByUserAndReponame(id, reponame);
};

const updateByUserAndReponame = async ({ owner, reponame, data }) => {
  const { id } = await userRepository.getByUsername(owner);
  return repoRepository.updateByUserAndReponame(id, reponame, data);
};

const deleteByUserAndReponame = async ({ owner, reponame }) => {
  const { id } = await userRepository.getByUsername(owner);
  return repoRepository.deleteByUserAndReponame(id, reponame);
};

const renameRepo = async ({ repoName, newName, username }) => {
  try {
    const oldDirectory = repoHelper.getPathToRepo(username, repoName);
    const newDirectory = repoHelper.getPathToRepo(username, newName);
    fs.renameSync(oldDirectory, newDirectory);
    await updateByUserAndReponame({ owner: username, reponame: repoName, data: { name: newName } });
    return true;
  } catch (e) {
    return false;
  }
};

const deleteRepo = async ({ repoName, username }) => {
  try {
    const directory = repoHelper.getPathToRepo(username, repoName);
    await fs.remove(directory);
    await deleteByUserAndReponame({ owner: username, reponame: repoName });
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

const setStar = async (userId, repositoryId) => {
  const star = await starRepository.getStar(userId, repositoryId);

  const result = star
    ? await starRepository.deleteById(star.id)
    : await starRepository.create({ userId, repositoryId });

  return Number.isInteger(result) ? {} : starRepository.getStar(userId, repositoryId);
};

module.exports = {
  createRepo,
  renameRepo,
  deleteRepo,
  getReposNames,
  checkName,
  isEmpty,
  forkRepo,
  getReposData,
  setStar,
  getByUserAndReponame,
  updateByUserAndReponame
};
