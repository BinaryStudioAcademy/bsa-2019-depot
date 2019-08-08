const NodeGit = require('nodegit');
const path = require('path');

const gitPath = process.env.GIT_PATH;

const getBranches = async ({ user, repoName }) => {
  const pathToRepo = path.resolve(`${gitPath}/${user}/${repoName}`);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const refNames = await repo.getReferenceNames(NodeGit.Reference.TYPE.LISTALL);

  // Cut the 'refs/heads/' from the reference name
  return refNames.map(refName => refName.slice(11));
};

module.exports = { getBranches };
