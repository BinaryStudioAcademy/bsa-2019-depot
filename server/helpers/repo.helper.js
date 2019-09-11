const path = require('path');
const fs = require('fs');
const NodeGit = require('nodegit');
const detect = require('language-detect');
const { gitPath } = require('../config/git.config.js');
const userRepository = require('../data/repositories/user.repository');
const repoRepository = require('../data/repositories/repository.repository');
const branchRepository = require('../data/repositories/branch.repository');
const commitRepository = require('../data/repositories/commit.repository');
const languageStatsService = require('../api/services/language-stats.service');

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

const updateLanguageStats = async (owner, reponame, branch) => {
  const pathToRepo = getPathToRepo(owner, reponame);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const lastCommit = await repo.getBranchCommit(branch);
  const branchTree = await lastCommit.getTree();
  const index = await repo.index();

  await index.readTree(branchTree);

  const filesData = index.entries().map((entry) => {
    const filename = entry.path.split('/').pop();
    const fileId = entry.id;

    return {
      filename,
      fileId
    };
  });

  const langs = await Promise.all(
    filesData.map(({ filename, fileId }) => repo.getBlob(fileId).then((blob) => {
      const content = blob.toString();
      return detect.contents(filename, content);
    }))
  );

  let fileCount = 0;
  const statCount = langs.reduce((map, langName) => {
    if (langName === 'Text' || langName === 'Markdown') {
      return map;
    }

    fileCount += 1;

    const langDataIdx = map.findIndex(lang => lang[0] === langName);
    if (langDataIdx === -1) {
      const langCount = 1;

      map.push([langName, langCount]);
      return map;
    }

    const updatedMap = map;
    updatedMap[langDataIdx][1] += 1;
    return updatedMap;
  }, []);

  const statPercentage = statCount.map(([langName, langCount]) => [
    langName,
    ((langCount / fileCount) * 100).toFixed(1)
  ]);
  return languageStatsService.upsertStats(statPercentage, reponame, owner, branch);
};

/* syncDb takes commits in form of:
 {
    repoOwner,
    reponame,
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
  const { repoOwner, reponame } = commits[0];
  const { id: userId } = await userRepository.getByUsername(repoOwner);
  const { id: repositoryId } = await repoRepository.getByUserAndReponame(userId, reponame);
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

  await updateLanguageStats(repoOwner, reponame, branch.name);
};

const getParentRepositoryId = async (repositoryId) => {
  const currentRepository = await repoRepository.getById(repositoryId);
  if (!currentRepository.forkedFromRepoId) {
    return repositoryId;
  }
  const parentRepoId = await getParentRepositoryId(currentRepository.forkedFromRepoId);
  return parentRepoId;
};

module.exports = {
  getPathToRepo,
  getPathToRepos,
  generateInitialData,
  syncDb,
  getParentRepositoryId
};
