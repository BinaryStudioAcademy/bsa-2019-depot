import nodegit from 'nodegit';

const getCommits = async ({user, name, branch}) => {
  let pathToRepo = require("path").resolve(`../repositories/${user}/${name}`);
  let allCommits = [];
  await nodegit.Repository.open(pathToRepo)
    .then(function(repo) {
      return repo.getBranchCommit(branch)
    })
    .then( function(firstCommitOnMaster){
      var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.TIME);
      var commitPromise = new Promise(function(resolve, reject) {
        history.on("commit", function(commit) {
          let commitObject = {
            commit: commit.sha(),
            author: commit.author().name(),
            date: commit.date(),
            message: commit.message(),
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