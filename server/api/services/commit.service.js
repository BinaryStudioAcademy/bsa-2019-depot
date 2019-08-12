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

const getCommitDiff = async ({ user, name /* hash */ }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${name}`).replace(/\\/g, '/');
  // const diffs = '';

  NodeGit.Repository.open(pathToRepo)
    .then(repo => repo.getCommit('197d311e41c1962953e541b843165d7c80e8f8fb'))
    .then((commit) => {
      console.warn(`commit ${commit.sha()}`);
      console.warn('Author:', `${commit.author().name()} <${commit.author().email()}>`);
      console.warn('Date:', commit.date());
      console.warn(`\n    ${commit.message()}`);

      return commit.getDiff();
      // commit.getDiff().then(console.log);
    })
    .done((diffList) => {
      console.warn(JSON.stringify(diffList));
      diffList.forEach((diff) => {
        diff.patches().then((patches) => {
          patches.forEach((patch) => {
            patch.hunks().then((hunks) => {
              hunks.forEach((hunk) => {
                hunk.lines().then((lines) => {
                  console.warn('diff', patch.oldFile().path(), patch.newFile().path());
                  console.warn(hunk.header().trim());
                  lines.forEach((line) => {
                    console.warn(String.fromCharCode(line.origin()) + line.content().trim());
                  });
                });
              });
            });
          });
        });
      });
    });
};

// const getPatches = (diffs) => {
//   const diffPromises = diffs.map((diff) => {
//     const promise = new Promise((resolve) => {
//       console.warn('getPatches', diff);
//       diff.patches().then(patches => resolve(patches));
//     });
//   });
//
//   return Promise.all(diffPromises);
// };

module.exports = { getCommits, getCommitDiff };
