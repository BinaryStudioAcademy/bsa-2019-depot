const NodeGit = require('nodegit');
const repoRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const repoHelper = require('../../helpers/repo.helper');
const tokenHelper = require('../../helpers/token.helper');

const getFileContent = async (owner, reponame, branch, path) => {
  try {
    const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
    const repo = await NodeGit.Repository.open(pathToRepo);
    const lastCommitOnBranch = await repo.getBranchCommit(branch);
    const entry = await lastCommitOnBranch.getEntry(path);
    const blob = await entry.getBlob();

    return {
      content: blob.isBinary() ? blob.content() : blob.toString(),
      size: blob.rawsize()
    };
  } catch (error) {
    const errorObj = new Error("Can't find the file");
    errorObj.status = 404;
    throw errorObj;
  }
};

const getRawFileContent = async (owner, reponame, branch, path, token) => {
  const { id: ownerId } = await userRepository.getByUsername(owner);
  const { isPublic } = await repoRepository.getByUserAndReponame(ownerId, reponame);
  if (!isPublic) {
    try {
      const { id: userId } = await tokenHelper.verifyToken(token);
      if (userId !== ownerId) {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      const errorObj = new Error('Unauthorized');
      errorObj.status = 401;
      throw errorObj;
    }
  }
  return getFileContent(owner, reponame, branch, path);
};

module.exports = { getFileContent, getRawFileContent };
