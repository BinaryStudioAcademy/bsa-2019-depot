const NodeGit = require('nodegit');
const repoHelper = require('../../helpers/repo.helper');
const branchRepository = require('../../data/repositories/branch.repository');

const getBranches = repoId => branchRepository.getByRepoId(repoId);

const getBranchInfo = (branchName, repoId) => branchRepository.getByNameAndRepoId(branchName, repoId);

const getLastModifiedCommit = async ({
  user, name, branch, entry
}) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const walker = repo.createRevWalk();
  walker.push(lastCommitOnBranch.sha());
  walker.sorting(NodeGit.Revwalk.SORT.Time);

  const history = await walker.fileHistoryWalk(entry.path(), 500);
  return history[0].commit;
};

const traverseFileTree = async (user, name, branch, tree) => {
  const fileTree = {
    directories: [],
    files: []
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const entry of tree.entries()) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const lastModifiedCommit = await getLastModifiedCommit({
        user,
        name,
        branch,
        entry
      });
      if (entry.isDirectory()) {
        fileTree.directories.push({
          sha: lastModifiedCommit.sha(),
          name: entry.name(),
          time: lastModifiedCommit.date(),
          commitMessage: lastModifiedCommit.message()
        });
      } else {
        let readmeContent;
        if (entry.name() === 'README.md') {
          // eslint-disable-next-line no-await-in-loop
          readmeContent = (await entry.getBlob()).toString();
        }
        fileTree.files.push({
          sha: lastModifiedCommit.sha(),
          name: entry.name(),
          time: lastModifiedCommit.date(),
          commitMessage: lastModifiedCommit.message(),
          ...(readmeContent ? { content: readmeContent } : {})
        });
      }
    } catch (error) {
      const errorObj = { status: 401, message: error };
      return Promise.reject(errorObj);
    }
  }
  return fileTree;
};

const getBranchTree = async ({
  user, name, branch, pathToDir
}) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const tree = await lastCommitOnBranch.getTree();

  if (pathToDir) {
    const entryAtPath = await tree.getEntry(pathToDir);
    const folderBeneath = await entryAtPath.getTree();
    const parent = folderBeneath.entry.dirtoparent;
    const parentDir = parent === '.' ? '' : parent;
    const currentPath = folderBeneath.path();
    const fileTree = await traverseFileTree(user, name, branch, folderBeneath);
    return {
      ...fileTree,
      parentDir,
      currentPath
    };
  }
  const fileTree = await traverseFileTree(user, name, branch, tree);
  return {
    ...fileTree,
    parentDir: '',
    currentPath: ''
  };
};

const getLastCommitOnBranch = async ({ user, name, branch }) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);

  return {
    sha: lastCommitOnBranch.sha(),
    author: lastCommitOnBranch.author().name(),
    date: lastCommitOnBranch.date(),
    message: lastCommitOnBranch.message()
  };
};

const checkFileExists = async (owner, repoName, branch, filepath) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const tree = await lastCommitOnBranch.getTree();
  const index = await repo.index();
  await index.readTree(tree);

  const file = index.getByPath(filepath, 0); // 0 === NodeGit.Index.STAGE.NORMAL, but this Enum doesn't work for some reason
  return { isFilenameUnique: !file };
};

module.exports = {
  getBranches,
  getBranchInfo,
  getBranchTree,
  getLastCommitOnBranch,
  checkFileExists
};
