const NodeGit = require('nodegit');
const repoHelper = require('../../helpers/repo.helper');

const getBranches = async ({ user, repoName }) => {
  // const pathToRepo = path.resolve(`${gitPath}/${user}/${repoName}`);
  const pathToRepo = repoHelper.getPathToRepo(user, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo.replace(/\\/g, '/'));
  const refNames = await repo.getReferenceNames(NodeGit.Reference.TYPE.LISTALL);

  // Cut the 'refs/heads/' from the reference name
  return refNames.map(refName => refName.slice(11));
};

const getLastModifiedCommit = async ({
  user, name, branch, entry
}) => {
  // const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo.replace(/\\/g, '/'));
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const walker = repo.createRevWalk();
  walker.push(lastCommitOnBranch.sha());
  walker.sorting(NodeGit.Revwalk.SORT.Time);

  const history = await walker.fileHistoryWalk(entry.path(), 500);
  return history[history.length - 1].commit;
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
          name: entry.name(),
          time: lastModifiedCommit.date(),
          commitMessage: lastModifiedCommit.message()
        });
      } else {
        fileTree.files.push({
          name: entry.name(),
          time: lastModifiedCommit.date(),
          commitMessage: lastModifiedCommit.message()
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  return fileTree;
};

const getBranchTree = async ({
  user, name, branch, pathToDir
}) => {
  // const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo.replace(/\\/g, '/'));
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
  // const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo.replace(/\\/g, '/'));
  const lastCommitOnBranch = await repo.getBranchCommit(branch);

  return {
    sha: lastCommitOnBranch.sha(),
    author: lastCommitOnBranch.author().name(),
    date: lastCommitOnBranch.date(),
    message: lastCommitOnBranch.message()
  };
};

module.exports = { getBranches, getBranchTree, getLastCommitOnBranch };
