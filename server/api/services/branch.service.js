const NodeGit = require('nodegit');
const repoHelper = require('../../helpers/repo.helper');
const userRepository = require('../../data/repositories/user.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const CustomError = require('../../helpers/error.helper');

const getBranches = repoId => branchRepository.getByRepoId(repoId);

const getBranchInfo = async (branchName, repoId) => {
  const branch = await branchRepository.getByNameAndRepoId(branchName, repoId);
  return (
    branch
    || Promise.reject(new CustomError(404, `Branch ${branchName} not found in repository with id ${repoId} not found`))
  );
};

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

const checkFileExists = async (owner, reponame, branch, filepath) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const tree = await lastCommitOnBranch.getTree();
  const index = await repo.index();
  await index.readTree(tree);

  const file = index.getByPath(filepath, 0); // 0 === NodeGit.Index.STAGE.NORMAL, but this Enum doesn't work for some reason
  return { isFilenameUnique: !file };
};

const getFileBlame = async ({
  user, name, branch, filepath
}) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const entry = await lastCommitOnBranch.getEntry(filepath);
  const blob = await entry.getBlob();
  const BlameArray = [];

  await NodeGit.Blame.file(repo, filepath, { newestCommit: lastCommitOnBranch.id() }).then(async (blame) => {
    let count = 0;
    for (let i = 0; i < blame.getHunkCount(); i += 1) {
      const hunk = blame.getHunkByIndex(i);
      for (let j = 0; j < hunk.linesInHunk(); j += 1) {
        // eslint-disable-next-line no-await-in-loop
        const commit = await repo.getCommit(hunk.finalCommitId().toString());
        // eslint-disable-next-line no-await-in-loop
        const userData = await userRepository.getByEmail(commit.author().email());
        const BlameObj = {
          author: commit.author().email(),
          username: userData.username,
          commitId: commit.sha(),
          name: userData.name,
          imgUrl: userData.imgUrl,
          message: commit.message(),
          date: commit.date(),
          line: blob
            .toString()
            .split('\n')
            .slice(count, count + 1)
            .join('\n')
        };
        BlameArray.push(BlameObj);
        count += 1;
      }
    }
  });

  return BlameArray;
};

module.exports = {
  getBranches,
  getBranchInfo,
  getBranchTree,
  getLastCommitOnBranch,
  getFileBlame,
  checkFileExists
};
