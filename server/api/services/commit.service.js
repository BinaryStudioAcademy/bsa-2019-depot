const NodeGit = require('nodegit');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const gitPath = process.env.GIT_PATH;

const getCommits = async ({ user, name, branch }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`).replace(/\\/g, '/');
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

const getCommitDiff = async ({ user, name, hash }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`).replace(/\\/g, '/');
  const cdCommand = `cd  ${pathToRepo} `;
  const gitDiffCommand = `git diff ${hash}~ ${hash} -U`;
  const command = `${cdCommand} && ${gitDiffCommand}`;
  const cmd = await exec(command);
  if (cmd.stderr) throw new Error(cmd.stderr);
  return { diffs: cmd.stdout };
};

module.exports = { getCommits, getCommitDiff };
