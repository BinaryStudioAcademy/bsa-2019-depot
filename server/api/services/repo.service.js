const NodeGit = require('nodegit');
const fs = require('fs-extra');
const fse = require('fs-extra');
const path = require('path');
const repoHelper = require('../../helpers/repo.helper');
const repoRepository = require('../../data/repositories/repository.repository');

const createRepo = async ({
  owner, name, userId, readme
}) => {
  let repo;
  let result = 'Repo was created';
  let oid;
  const pathToRepo = repoHelper.getPathToRepo(owner, name);
  await NodeGit.Repository.init(pathToRepo, 1)
    .then((repoResult) => {
      result = {
        msg: 'Repo created',
        url: pathToRepo
      };
      repo = repoResult;
      console.log('f1f');
      return repo.getHeadCommit()
        .then(commit => repo.createBranch(
          'master',
          commit,
          12320
        ));
    })
    .then(() => repo.refreshIndex())
    .then((indexResult) => {
      console.log('ff');
      repoHelper.createReadme(owner, name);
      index = indexResult;

      // this file is in the root of the directory and doesn't need a full path
      index.addByPath('README.md');

      // this will write files to the index
      index.write();
      console.log('ff');
      return index.writeTree();
    })
    .then((oidResult) => {
      oid = oidResult;

      return NodeGit.Reference.nameToId(repo, 'HEAD');
    })
    .then(head => repo.getCommit(head))
    .then((parent) => {
      author = NodeGit.Signature.now('Author Name', 'author@email.com');
      committer = NodeGit.Signature.now('Commiter Name', 'commiter@email.com');

      return repo.createCommit('HEAD', author, committer, 'Added the Readme file for theme builder', oid, [parent]);
    })
    .then(commitId => console.log('New Commit: ', commitId));

  if (readme) {
    // repoHelper.createReadme(owner, name);
    let repo;
    let index;
    let oid;
    const fileToStage = 'README.md';
    const fileContent = `# ${name}`;
    const directoryName = '/test';
    console.log(pathToRepo);
    await NodeGit.Repository.open(pathToRepo)
      .then((repoResult) => {
        repo = repoResult;
        return repoResult.openIndex();
      })
      .then((indexResult) => {
        index = indexResult;

        // this file is in the root of the directory and doesn't need a full path
        index.addByPath(fileToStage);

        // this will write files to the index
        index.write();

        return index.writeTree();
      })
      .then((oidResult) => {
        oid = oidResult;

        return NodeGit.Reference.nameToId(repo, 'HEAD');
      })
      .then(head => repo.getCommit(head))
      .then((parent) => {
        author = NodeGit.Signature.now('Author Name', 'author@email.com');
        committer = NodeGit.Signature.now('Commiter Name', 'commiter@email.com');

        return repo.createCommit('HEAD', author, committer, 'Added the Readme file for theme builder', oid, [parent]);
      })
      .then(commitId => console.log('New Commit: ', commitId));
  }

  repoRepository.create({
    userId,
    name
  });
  return result;
};

const checkName = async ({ owner, reponame }) => {
  const filePath = repoHelper.getPathToRepo(owner, reponame);
  const exists = await fs.existsSync(filePath);
  return exists;
};

const isEmpty = async ({ owner, reponame }) => {
  try {
    let result;
    const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
    console.log(pathToRepo);
    await NodeGit.Repository.open(pathToRepo).then((repo) => {
      console.dir(repo.getStatus());
      result = repo.isEmpty();
    });
    return {
      isEmpty: Boolean(result),
      url: pathToRepo
    };
  } catch (e) {
    console.warn(e);
    return e;
  }
};

const renameRepo = async ({ repoName, newName, username }) => {
  try {
    const oldDirectory = repoHelper.getPathToRepo(username, repoName);
    const newDirectory = repoHelper.getPathToRepo(username, newName);
    fs.renameSync(oldDirectory, newDirectory);
    return true;
  } catch (e) {
    return false;
  }
};

const deleteRepo = async ({ repoName, username }) => {
  try {
    const directory = repoHelper.getPathToRepo(username, repoName);
    await fs.remove(directory);
    return true;
  } catch (e) {
    return false;
  }
};

const getReposNames = async ({ user, filter, limit }) => {
  const pathToRepo = repoHelper.getPathToRepos(user);
  const doesDirExists = fs.existsSync(pathToRepo);
  if (doesDirExists) {
    const repos = fs
      .readdirSync(pathToRepo, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name.slice(0, -4));
    const filteredRepos = filter ? repos.filter(repo => repo.includes(filter)) : repos;
    return limit ? filteredRepos.slice(0, limit) : repos;
  }
  return [];
};

const forkRepo = async ({ username, owner, repoName }) => {
  try {
    const source = repoHelper.getPathToRepo(owner, repoName);
    const target = repoHelper.getPathToRepo(username, repoName);

    if (!fs.existsSync(source)) {
      return { status: false, error: 'repo to copy doesn`t exist' };
    }

    if (fs.existsSync(target)) {
      return { status: false, error: 'such repo already exists' };
    }

    fs.mkdirSync(target);
    return await fse
      .copy(source, target, { preserveTimestamps: true })
      .then(() => ({ status: true, path: target }))
      .catch(err => ({ status: false, error: err.message }));
  } catch (err) {
    return { status: false, error: err.message };
  }
};

module.exports = {
  createRepo,
  renameRepo,
  deleteRepo,
  getReposNames,
  checkName,
  isEmpty,
  forkRepo
};
