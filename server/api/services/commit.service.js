const NodeGit = require('nodegit');
const { gitpath } = require('../../config/git.config');

const getCommits = async ({ user, name, branch }) => {
  const pathToRepo = require('path').resolve(`../${gitpath}/${user}/${name}`);
  const allCommits = [];
  await NodeGit.Repository.open(pathToRepo)
    .then(function(repo) {
      return repo.getBranchCommit(branch);
    })
    .then(function(firstCommitOnMaster) {
      const history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
      const commitPromise = new Promise(function(resolve, reject) {
        history.on('commit', function(commit) {
          const commitObject = {
            commit: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message()
          };
          allCommits.push(commitObject);
        });
        history.on('end', function(commits) {
          resolve();
        });
      });
      history.start();
      return commitPromise;
    });
  return allCommits;
};

module.exports = { getCommits };
