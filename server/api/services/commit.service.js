const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { getReposNames } = require('./repo.service');
const repoHelper = require('../../helpers/repo.helper');

const getCommits = async ({ user, name, branch }) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const allCommits = [];
  await NodeGit.Repository.open(pathToRepo)
    .then(repo => repo.getBranchCommit(branch))
    .then((firstCommitOnMaster) => {
      const history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
      const commitPromise = new Promise((resolve) => {
        history.on('commit', (commit) => {
          const commitObject = {
            sha: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message()
          };
          allCommits.push(commitObject);
        });
        history.on('end', () => {
          resolve();
        });
      });
      history.start();
      return commitPromise;
    });
  return allCommits;
};

const getCommitsByDate = async (data) => {
  const { user } = data;
  const repoList = await getReposNames(data);
  let globalCommits = [];
  const promises = repoList.map((repoName) => {
    const pathToRepo = repoHelper.getPathToRepo(user, repoName);
    return NodeGit.Repository.open(pathToRepo).then((repo) => {
      const walker = NodeGit.Revwalk.create(repo);
      walker.pushGlob('refs/heads/*');
      walker.sorting(NodeGit.Revwalk.SORT.TIME);
      return walker
        .getCommitsUntil(commit => commit)
        .then((commits) => {
          const repoCommits = commits.map(commit => ({
            sha: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message().split('\n')[0],
            repo: repoName
          }));
          globalCommits = globalCommits.concat(repoCommits);
        });
    });
  });

  const allCommits = await Promise.all(promises).then(() => Promise.resolve(globalCommits));
  const userActivitybyDate = {};
  const monthActivity = {};
  allCommits.forEach(({ date }) => {
    const stringifiedDate = JSON.stringify(date);
    const fullDate = stringifiedDate.slice(1, 11);
    const monthAndYear = stringifiedDate.slice(1, 8);
    if (fullDate in userActivitybyDate) {
      userActivitybyDate[fullDate] += 1;
    } else {
      userActivitybyDate[fullDate] = 1;
    }
    if (!(monthAndYear in monthActivity)) {
      monthActivity[monthAndYear] = 1;
    } else {
      monthActivity[monthAndYear] += 1;
    }
  });
  return { userActivitybyDate, monthActivity };
};

const getCommitDiff = async ({ user, name, hash }) => {
  const pathToRepo = repoHelper.getPathToRepo(user, name);
  const cdCommand = `cd  ${pathToRepo} `;
  const gitDiffCommand = `git diff ${hash}~ ${hash} -U`;
  const command = `${cdCommand} && ${gitDiffCommand}`;
  const cmd = await exec(command);
  if (cmd.stderr) throw new Error(cmd.stderr);
  return { diffs: cmd.stdout };
};

module.exports = { getCommits, getCommitDiff, getCommitsByDate };
