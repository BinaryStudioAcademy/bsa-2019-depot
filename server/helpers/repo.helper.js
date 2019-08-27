const path = require('path');
const fs = require('fs');
const { gitPath } = require('../config/git.config.js');
const userRepository = require('../data/repositories/user.repository');
const repoRepository = require('../data/repositories/repository.repository');
const branchRepository = require('../data/repositories/branch.repository');
const commitRepository = require('../data/repositories/commit.repository');

const getPathToRepo = (username, reponame) => path.resolve(`${gitPath}/${username}/${reponame}.git`).replace(/\\/g, '/');
const getPathToRepos = username => path.resolve(`${gitPath}/${username}`).replace(/\\/g, '/');

const getGitignore = gitignore => fs.readFileSync(path.resolve(`${__dirname}/../data/initial-files/gitignores/${gitignore}`));
const getLicense = license => fs.readFileSync(path.resolve(`${__dirname}/../data/initial-files/licenses/${license}`));

const generateInitialData = ({
  name, email, readme, gitignore, license
}) => {
  const files = [];
  if (readme) {
    files.push({
      filename: 'README.md',
      content: `# ${name}`
    });
  }
  if (gitignore) {
    files.push({
      filename: '.gitignore',
      content: getGitignore(gitignore)
    });
  }
  if (license) {
    files.push({
      filename: 'LICENSE',
      content: getLicense(license)
    });
  }
  return files.length !== 0
    ? {
      files,
      email
    }
    : null;
};

/* syncDb takes commits in form of:
 {
    repoOwner,
    repoName,
    sha,
    message,
    userEmail, // Email of the commit's author
    createdAt
 }

 And branch in form of:
 {
    name,
    newHeadSha
 }
*/
const syncDb = async (commits, branch) => {
  const { id: userId } = await userRepository.getByUsername(commits[0].repoOwner);
  const { id: repositoryId } = await repoRepository.getByUserAndReponame(userId, commits[0].repoName);
  const commitAuthors = await Promise.all(commits.map(({ userEmail }) => userRepository.getByEmail(userEmail)));
  const addedCommits = await Promise.all(
    commitAuthors.map(({ id: authorId }, index) => commitRepository.add({
      sha: commits[index].sha,
      message: commits[index].message,
      userId: authorId,
      createdAt: new Date(commits[index].createdAt),
      updatedAt: new Date(commits[index].createdAt),
      repositoryId
    }))
  );
  const headCommitId = addedCommits.find(({ sha }) => sha === branch.newHeadSha).id;

  const existingBranch = await branchRepository.getByNameAndRepoId(branch.name, repositoryId);
  if (!existingBranch) {
    await branchRepository.create({
      name: branch.name,
      headCommitId,
      createdAt: addedCommits[addedCommits.length - 1].createdAt,
      repositoryId
    });
  } else {
    await branchRepository.updateById(existingBranch.id, {
      headCommitId
    });
  }
};

module.exports = {
  getPathToRepo,
  getPathToRepos,
  generateInitialData,
  syncDb
};
