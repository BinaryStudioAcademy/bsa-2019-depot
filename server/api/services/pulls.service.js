const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoRepository = require('../../data/repositories/repository.repository');
const commitRepository = require('../../data/repositories/commit.repository');
const userRepository = require('../../data/repositories/user.repository');
const repoHelper = require('../../helpers/repo.helper');

const getDiffCommits = async (pathToRepo, fromBranch, toBranch) => {
  const repo = await NodeGit.Repository.open(pathToRepo);

  const setListeners = headCommit => new Promise((resolve, reject) => {
    const walker = headCommit.history();

    walker.on('end', (commits) => {
      resolve(commits);
    });
    walker.on('error', error => reject(error));

    walker.start();
  });

  const fromBranchCommits = await repo.getBranchCommit(fromBranch)
    .then(setListeners);
  const toBranchCommits = await repo.getBranchCommit(toBranch)
    .then(setListeners);

  const fromBranchShas = fromBranchCommits.map(commit => commit.sha());
  const toBranchShas = toBranchCommits.map(commit => commit.sha());

  let filteredShas;
  const commonCommitSha = toBranchShas.find(sha => fromBranchShas.includes(sha));
  if (!commonCommitSha) {
    filteredShas = fromBranchShas;
  } else {
    const commonCommitIndex = fromBranchShas.findIndex(sha => sha === commonCommitSha);
    filteredShas = fromBranchShas.slice(0, commonCommitIndex);
  }

  return Promise.all(filteredShas.map(sha => commitRepository.getByHash(sha)));
};

const getBranchDiffs = async (pathToRepo, fromBranch, toBranch) => {
  const getDiffsCommand = `cd ${pathToRepo} && git diff -U1 ${toBranch}...${fromBranch}`;
  const diffsOutput = await exec(getDiffsCommand);

  if (diffsOutput.stderr) {
    throw new Error(diffsOutput.stderr);
  }

  return diffsOutput.stdout;
};

const getPullData = async (repoId, fromBranch, toBranch) => {
  const { userId, name: reponame } = await repoRepository.getById(repoId);
  const { username: owner } = await userRepository.getUserById(userId);
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);

  const diffs = await getBranchDiffs(pathToRepo, fromBranch, toBranch);
  const commits = await getDiffCommits(pathToRepo, fromBranch, toBranch);

  return {
    diffs,
    commits
  };
};

module.exports = { getPullData };
