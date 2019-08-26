const NodeGit = require('nodegit');
const fs = require('fs-extra');
const copydir = require('copy-dir');
const repoHelper = require('../../helpers/repo.helper');
const repoRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const starRepository = require('../../data/repositories/star.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const commitRepository = require('../../data/repositories/commit.repository');

const initialCommit = async ({
  owner, email, repoName, files
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const treeBuilder = await NodeGit.Treebuilder.create(repo, null);
  const authorSignature = NodeGit.Signature.now(owner, email);

  const fileBlobOids = await Promise.all(
    files.map(({ content, filename }) => {
      const fileBuffer = Buffer.from(content);
      return NodeGit.Blob.createFromBuffer(repo, fileBuffer, fileBuffer.length).then(oid => ({ oid, filename }));
    })
  );

  fileBlobOids.forEach(({ oid, filename }) => {
    treeBuilder.insert(filename, oid, NodeGit.TreeEntry.FILEMODE.BLOB);
  });

  const newCommitTree = await treeBuilder.write();
  const commitId = await repo.createCommit(
    'HEAD',
    authorSignature,
    authorSignature,
    'Initial commit',
    newCommitTree,
    []
  );

  const commit = await repo.getCommit(commitId);
  return NodeGit.Branch.create(repo, 'master', commit, 1);
};

const createRepo = async (repoData) => {
  const {
    owner, name, userId, description
  } = repoData;
  let result = 'Repo was created';
  const pathToRepo = repoHelper.getPathToRepo(owner, name);
  await NodeGit.Repository.init(pathToRepo, 1)
    .then(() => {
      result = {
        msg: 'Repo created',
        url: pathToRepo
      };
    })
    .catch(() => {
      const errorObj = { status: 404, message: 'Error! Repos wasn`t created' };
      Promise.reject(errorObj);
    });

  const initialData = repoHelper.generateInitialData({ ...repoData });
  // Initial data has to contain 'email' (of user) and 'files' in form of [ { filename, content }, {... ]
  if (initialData) {
    await initialCommit({
      owner,
      repoName: name,
      ...initialData
    });
  }

  repoRepository.create({
    userId,
    name,
    description
  });
  return result;
};

const checkName = async ({ owner, reponame }) => {
  const { id } = await userRepository.getByUsername(owner);
  const repository = await repoRepository.getByUserAndReponame(id, reponame);
  return Boolean(repository);
};

const isEmpty = async ({ owner, reponame }) => {
  try {
    let result;
    const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
    await NodeGit.Repository.open(pathToRepo).then((repo) => {
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

const getByUserAndReponame = async ({ owner, reponame }) => {
  const { id } = await userRepository.getByUsername(owner);
  return repoRepository.getByUserAndReponame(id, reponame);
};

const updateByUserAndReponame = async ({ owner, reponame, data }) => {
  const { id } = await userRepository.getByUsername(owner);
  return repoRepository.updateByUserAndReponame(id, reponame, data);
};

const deleteByUserAndReponame = async ({ owner, reponame }) => {
  const { id } = await userRepository.getByUsername(owner);
  return repoRepository.deleteByUserAndReponame(id, reponame);
};

const renameRepo = async ({ repoName, newName, username }) => {
  try {
    const oldDirectory = repoHelper.getPathToRepo(username, repoName);
    const newDirectory = repoHelper.getPathToRepo(username, newName);
    fs.renameSync(oldDirectory, newDirectory);
    await updateByUserAndReponame({ owner: username, reponame: repoName, data: { name: newName } });
    return true;
  } catch (e) {
    return e;
  }
};

const deleteRepo = async ({ repoName, username }) => {
  try {
    const directory = repoHelper.getPathToRepo(username, repoName);
    await fs.remove(directory);
    const { id: repositoryId } = await getByUserAndReponame({ owner: username, reponame: repoName });
    await deleteByUserAndReponame({ owner: username, reponame: repoName });
    await branchRepository.deleteByRepoId(repositoryId);
    await commitRepository.deleteByRepoId(repositoryId);
    return true;
  } catch (e) {
    return e;
  }
};

const getReposNames = async ({ user: username, filter, limit }) => {
  const { id } = await userRepository.getByUsername(username);
  const findOptions = {
    filter,
    limit,
    sortByCreatedDateDesc: true
  };
  const repos = await repoRepository.getByUserWithOptions(id, findOptions);
  return repos.map(({ name }) => name);
};

const getReposData = async ({ username }) => {
  const { id } = await userRepository.getByUsername(username);
  return repoRepository.getByUserWithOptions(id);
};

const forkRepo = async ({
  userId, username, owner, name, website, description, forkedFromRepoId
}) => {
  try {
    const source = repoHelper.getPathToRepo(owner, name);
    const target = repoHelper.getPathToRepo(username, name);

    await fs.mkdir(target, { recursive: true });
    await copydir(
      source,
      target,
      {
        utimes: true,
        mode: true,
        cover: true
      },
      (err) => {
        if (err) throw err;
      }
    );
    await repoRepository.create({
      userId,
      name,
      website,
      description,
      forkedFromRepoId
    });

    return { status: true, username };
  } catch (err) {
    return { status: false, error: err.message };
  }
};

const setStar = async (userId, repositoryId) => {
  const star = await starRepository.getStar(userId, repositoryId);

  const result = star
    ? await starRepository.deleteById(star.id)
    : await starRepository.create({ userId, repositoryId });

  return Number.isInteger(result) ? {} : starRepository.getStar(userId, repositoryId);
};

module.exports = {
  createRepo,
  renameRepo,
  deleteRepo,
  getReposNames,
  checkName,
  isEmpty,
  forkRepo,
  getReposData,
  setStar,
  getByUserAndReponame,
  updateByUserAndReponame
};
