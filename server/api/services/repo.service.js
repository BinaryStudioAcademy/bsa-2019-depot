const NodeGit = require('nodegit');
const path = require('path');

const repoRepository = require('../../data/repositories/repo.repository');
const repoHelper = require('../../helpers/repo.helper');

const { readdirSync } = require('fs');

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

const getSettings = async ({ ownerID, repoName }) => {
  const settings = await repoRepository.getSettings({
    ownerID,
    repoName
  });
  return settings;
};

const renameRepo = async ({ ownerID, repoName, newName }) => {
  const result = await repoRepository.renameRepo({
    ownerID,
    repoName,
    newName
  });
  return result;
};

const changePrivacyRepo = async ({ ownerID, repoName }) => {
  const result = await repoRepository.changePrivacy({
    ownerID,
    repoName
  });
  return result;
};

const deleteRepo = async ({ ownerID, repoName, username }) => {
  const result = await repoRepository.delete({
    ownerID,
    repoName
  });

  const success = await repoHelper.removeDir(username, repoName);
  return result && success;
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
  getSettings,
  renameRepo,
  changePrivacyRepo,
  deleteRepo,
  getReposNames
};
