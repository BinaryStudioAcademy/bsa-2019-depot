const NodeGit = require('nodegit');
const path = require('path');

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
  let diffs = '';
  await NodeGit.Repository.open(pathToRepo)
    .then(repo => repo.getCommit(hash))
    .then(commit => commit.getDiff())
    .then(
      diffListPromise => new Promise((resolve) => {
        diffListPromise.forEach(async (diff) => {
          console.warn(diff);
          const patches = await diff.patches();
          console.warn(patches);

          patches.forEach(async (patch) => {
            const hunks = await patch.hunks();

            console.warn('hunks');
            console.warn(hunks);
            hunks.forEach(async (hunk) => {
              const lines = await hunk.lines();
              diffs += `diff  --git a/${patch.oldFile().path()}  b/${patch.newFile().path()}\n`;
              diffs += 'index a..b\n';
              diffs += `${hunk.header().trim()}\n`;
              lines.forEach((line) => {
                diffs += `${String.fromCharCode(line.origin())} ${line.content().trim()}\n`;
              });
              resolve(diffs);
              console.warn(diffs);
            });
          });
        });
      })
    );
  console.warn('diffList');
  // console.warn(diffList);

  return diffs;
};

module.exports = { getCommits, getCommitDiff };
