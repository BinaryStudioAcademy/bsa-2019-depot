const NodeGit = require('nodegit');
const fs = require('fs-extra');
const path = require('path');
const copydir = require('copy-dir');
const repoHelper = require('../../helpers/repo.helper');
const repoRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const starRepository = require('../../data/repositories/star.repository');
const branchRepository = require('../../data/repositories/branch.repository');
const commitRepository = require('../../data/repositories/commit.repository');

const CustomError = require('../../helpers/error.helper');
const {defaultLabels} = require('../../config/labels.config');
const {createLabel} = require('./label.service');

const initialCommit = async ({
                               owner, email, repoName, files
                             }) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, repoName);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const treeBuilder = await NodeGit.Treebuilder.create(repo, null);
  const authorSignature = NodeGit.Signature.now(owner, email);

  const fileBlobOids = await Promise.all(
    files.map(({content, filename}) => {
      const fileBuffer = Buffer.from(content);
      return NodeGit.Blob.createFromBuffer(repo, fileBuffer, fileBuffer.length).then(oid => ({oid, filename}));
    })
  );

  fileBlobOids.forEach(({oid, filename}) => {
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
  await NodeGit.Branch.create(repo, 'master', commit, 1);

  await repoHelper.syncDb(
    [
      {
        repoOwner: owner,
        repoName,
        sha: commit.sha(),
        message: 'Initial commit',
        userEmail: email,
        createdAt: new Date()
      }
    ],
    {
      name: 'master',
      newHeadSha: commit.sha()
    }
  );
};

const createRepo = async (repoData) => {
  const {
    owner, name, userId, description, isPublic
  } = repoData;
  let result = 'Repo was created';
  const pathToRepo = repoHelper.getPathToRepo(owner, name);
  await NodeGit.Repository.init(pathToRepo, 1)
    .then(async () => {
      result = {
        msg: 'Repo created',
        url: pathToRepo
      };

      await fs.copy(
        path.resolve(`${__dirname}/../../../scripts/git-hooks/pre-receive`),
        path.resolve(`${pathToRepo}/hooks/pre-receive`)
      );
      await fs.copy(
        path.resolve(`${__dirname}/../../../scripts/git-hooks/update`),
        path.resolve(`${pathToRepo}/hooks/update`)
      );
    })
    .catch(() => {
      Promise.reject(new CustomError(404, 'Error! Repos wasn`t created'));
    });
  const repository = await repoRepository.create({
    userId,
    name,
    description,
    isPublic
  });

  // add default labels for repository
  const {id} = repository;
  await Promise.all(defaultLabels.map(label => createLabel({repositoryId: id, ...label})));

  const initialData = repoHelper.generateInitialData({...repoData});
  // Initial data has to contain 'email' (of user) and 'files' in form of [ { filename, content }, {... ]
  if (initialData) {
    await initialCommit({
      owner,
      repoName: name,
      ...initialData
    });
  }

  return result;
};

const checkName = async ({owner, reponame}) => {
  const {id} = await userRepository.getByUsername(owner);
  const repository = await repoRepository.getByUserAndReponame(id, reponame);
  return Boolean(repository);
};

const isEmpty = async ({owner, reponame}) => {
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

const getByUserAndReponame = async ({owner, reponame}) => {
  const user = await userRepository.getByUsername(owner);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${owner} not found`));
  }
  const repository = await repoRepository.getByUserAndReponame(user.get({plain: true}).id, reponame);
  if (!repository) {
    return Promise.reject(new CustomError(404, `Repository ${reponame} not found`));
  }
  const branches = await branchRepository.getByRepoId(repository.get({plain: true}).id);
  const branchesNames = branches.map((branch) => {
    const {name} = branch.get({plain: true});
    return name;
  });
  return {
    ...repository.get({plain: true}),
    branches: branchesNames
  };
};

const updateByUserAndReponame = async ({owner, reponame, data}) => {
  const user = await userRepository.getByUsername(owner);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${owner} not found`));
  }
  return repoRepository.updateByUserAndReponame(user.id, reponame, data);
};

const deleteByUserAndReponame = async ({owner, reponame}) => {
  const user = await userRepository.getByUsername(owner);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${owner} not found`));
  }
  return repoRepository.deleteByUserAndReponame(user.id, reponame);
};

const renameRepo = async ({repoName, newName, username}) => {
  try {
    const oldDirectory = repoHelper.getPathToRepo(username, repoName);
    const newDirectory = repoHelper.getPathToRepo(username, newName);
    fs.renameSync(oldDirectory, newDirectory);
    await updateByUserAndReponame({owner: username, reponame: repoName, data: {name: newName}});
    return true;
  } catch (e) {
    return e;
  }
};

const deleteRepo = async ({repoName, username}) => {
  try {
    const directory = repoHelper.getPathToRepo(username, repoName);
    await fs.remove(directory);
    const {id: repositoryId} = await getByUserAndReponame({owner: username, reponame: repoName});
    await deleteByUserAndReponame({owner: username, reponame: repoName});
    await branchRepository.deleteByRepoId(repositoryId);
    await commitRepository.deleteByRepoId(repositoryId);
    return true;
  } catch (e) {
    return e;
  }
};

const getReposNames = async ({user: username, filter, limit}) => {
  const user = await userRepository.getByUsername(username);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${username} not found`));
  }
  const findOptions = {
    filter,
    limit,
    sortByCreatedDateDesc: true
  };
  const repos = await repoRepository.getByUserWithOptions(user.id, findOptions);
  return repos.map(({name}) => name);
};

const getReposData = async ({username, isOwner}) => {
  const user = await userRepository.getByUsername(username);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${username} not found`));
  }
  return repoRepository.getByUserWithOptions(user.id, isOwner);
};

const forkRepo = async ({
                          userId, username, owner, name, website, description, forkedFromRepoId
                        }) => {
  try {
    const source = repoHelper.getPathToRepo(owner, name);
    const target = repoHelper.getPathToRepo(username, name);

    await fs.mkdir(target, {recursive: true});
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

    const currentRepoBranches = await branchRepository.getAllRepoBranches(forkedFromRepoId);
    const currentRepoCommits = await commitRepository.getAllRepoCommits(forkedFromRepoId);

    const {id} = await repoRepository.create({
      userId,
      name,
      website,
      description,
      forkedFromRepoId
    });

    const branchesPromises = currentRepoBranches.map(branch => branchRepository.create({...branch, repositoryId: id}));
    await Promise.all(branchesPromises);
    const commitPromises = currentRepoCommits.map(commit => commitRepository.create({...commit, repositoryId: id}));
    await Promise.all(commitPromises);
    return {status: true, username};
  } catch (err) {
    return Promise.reject(new CustomError(500, err.message));
  }
};

const setStar = async (userId, repositoryId) => {
  const star = await starRepository.getStar(userId, repositoryId);

  const result = star
    ? await starRepository.deleteById(star.id)
    : await starRepository.create({userId, repositoryId});

  return Number.isInteger(result) ? {} : starRepository.getStar(userId, repositoryId);
};

const getRepoData = async repositoryId => repoRepository.getRepositoryById(repositoryId);

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
  updateByUserAndReponame,
  getRepoData
};
