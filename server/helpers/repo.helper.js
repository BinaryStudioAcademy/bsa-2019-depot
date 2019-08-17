const path = require('path');
const fs = require('fs');
const { gitPath } = require('../config/git.config.js');

const getPathToRepo = (username, reponame) => path.resolve(`${gitPath}/${username}/${reponame}.git`).replace(/\\/g, '/');
const getPathToRepos = username => path.resolve(`${gitPath}/${username}`).replace(/\\/g, '/');

const getGitignore = gitignore => fs.readFileSync(path.resolve(`../server/data/initial-files/gitignores/${gitignore}`));
const getLicense = license => fs.readFileSync(path.resolve(`../server/data/initial-files/licenses/${license}`));

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

module.exports = {
  getPathToRepo,
  getPathToRepos,
  generateInitialData
};
