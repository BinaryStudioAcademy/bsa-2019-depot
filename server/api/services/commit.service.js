const NodeGit = require('nodegit');

const gitPath = process.env.GIT_PATH;

const getCommits = async ({ user, name, branch }) => {
  const pathToRepo = require('path').resolve(`${gitPath}/${user}/${name}`);
  const allCommits = [];
  await NodeGit.Repository.open(pathToRepo)
    .then(repo => repo.getBranchCommit(branch))
    .then(firstCommitOnMaster => {
      const history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
      const commitPromise = new Promise((resolve, reject) => {
        history.on('commit', commit => {
          const commitObject = {
            commit: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message()
          };
          allCommits.push(commitObject);
        });
        history.on('end', commits => {
          resolve();
        });
      });
      history.start();
      return commitPromise;
    });
  return allCommits;
};

module.exports = { getCommits };
