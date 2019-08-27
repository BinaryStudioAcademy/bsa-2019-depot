const NodeGit = require('nodegit');
const repoHelper = require('../../helpers/repo.helper');

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
    const errorObj = new Error('Can\'t find the file');
    errorObj.status = 404;
    throw errorObj;
  }
};

module.exports = { getFileContent };
