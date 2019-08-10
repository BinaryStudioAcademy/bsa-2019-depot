const NodeGit = require('nodegit');
const path = require('path');

const gitPath = process.env.GIT_PATH;

const getBranches = async ({ user, repoName }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${repoName}`);
  const repo = await NodeGit.Repository.open(pathToRepo.replace(/\\/g, '/'));
  const refNames = await repo.getReferenceNames(NodeGit.Reference.TYPE.LISTALL);

  // Cut the 'refs/heads/' from the reference name
  return refNames.map(refName => refName.slice(11));
};

const getBranchTree = async ({ user, name, branch }) => {
  const fileTree = {
    directories: [],
    files: []
  };
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
  const repo = await NodeGit.Repository.open(pathToRepo.replace(/\\/g, '/'));
  const lastCommitOnBranch = await repo.getBranchCommit(branch);
  const tree = await lastCommitOnBranch.getTree();
  tree.entries().forEach(async (entry) => {
    try {
      // const entryOid = await entry.oid();
      // console.log(entryOid);
      // const lastModifiedCommit = await repo.getCommit(entryOid);
      // console.log(lastModifiedCommit);
      if (entry.isDirectory()) {
        fileTree.directories.push({
          name: entry.name()
          // time: lastModifiedCommit.date(),
          // commitName: lastModifiedCommit.name()
        });
      } else {
        fileTree.files.push({
          name: entry.name()
          // time: lastModifiedCommit.date(),
          // commitName: lastModifiedCommit.name()
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
  // fileTree.directories = tree.entries()
  //   .filter(entry => entry.isDirectory())
  //   .map(directory => directory.name());
  // fileTree.files = tree.entries()
  //   .filter(entry => entry.isFile())
  //   .map(file => file.name());
  return fileTree;
};

const getLastCommitOnBranch = async ({ user, name, branch }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
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
