const NodeGit = require('nodegit');
const detect = require('language-detect');
const linguistData = require('language-map');
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
    const errorObj = new Error('Can\'t find the file');
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

const getLangStats = async (owner, reponame, branch) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommit = await repo.getBranchCommit(branch);
  const branchTree = await lastCommit.getTree();
  const index = await repo.index();

  await index.readTree(branchTree);

  const filesData = index.entries().map((entry) => {
    const filename = entry.path.split('/').pop();
    const fileId = entry.id;

    return {
      filename,
      fileId
    };
  });

  const langs = await Promise.all(filesData.map(({ filename, fileId }) => repo.getBlob(fileId)
    .then((blob) => {
      const content = blob.toString();
      return detect.contents(filename, content);
    })));

  let fileCount = 0;
  const statCount = langs.reduce((map, langName) => {
    if (langName === 'Text' || langName === 'Markdown') {
      return map;
    }

    fileCount += 1;

    const langDataIdx = map.findIndex(lang => lang[0] === langName);
    if (langDataIdx === -1) {
      const langData = {
        color: linguistData[langName].color,
        count: 1
      };

      map.push([langName, langData]);
      return map;
    }

    const updatedMap = map;
    updatedMap[langDataIdx][1].count += 1;
    return updatedMap;
  }, []);

  return new Map(statCount.map(([langName, { color, count }]) => [langName, { color, percentage: (count / fileCount).toFixed(1) * 100 }]));
};

module.exports = { getFileContent, getRawFileContent, getLangStats };
