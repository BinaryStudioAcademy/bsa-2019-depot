const NodeGit = require('nodegit');
const path = require('path');

const gitPath = process.env.GIT_PATH;

const getCommits = async ({ user, name, branch }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`);
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

module.exports = { getCommits };
