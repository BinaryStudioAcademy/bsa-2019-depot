const path = require('path');
const fs = require('fs');
const { gitPath, gitignores, licenses } = require('../config/git.config.js');

const getPathToRepo = (username, reponame) => path.resolve(`${gitPath}/${username}/${reponame}.git`).replace(/\\/g, '/');
const getPathToRepos = username => path.resolve(`${gitPath}/${username}`).replace(/\\/g, '/');

const createReadme = (username, reponame) => {
  const pathToReadme = `${getPathToRepo(username, reponame)}/README.md`;
  fs.writeFileSync(pathToReadme, `# ${reponame}`);
};

const generateInitialData = ({
  name, email, readme, gitignore, license
}) => {
  const initialData = {
    files: [],
    email
  };
  if (readme) {
    initialData.files.push({
      filename: 'README.md',
      content: `# ${name}`
    });
  }
  if (gitignore) {
    initialData.files.push({
      filename: '.gitignore',
      content: gitignores[gitignore]
    });
  }
  if (license) {
    initialData.files.push({
      filename: 'LICENSE',
      content: licenses[license]
    });
  }
  return initialData;
};

module.exports = {
  getPathToRepo,
  getPathToRepos,
  createReadme,
  generateInitialData
};
