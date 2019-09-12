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
const collaboratorRepository = require('../../data/repositories/collaborator.repository');
const LabelRepository = require('../../data/repositories/label.repository');
const orgUsersRepository = require('../../data/repositories/org-user.repository');

const CustomError = require('../../helpers/error.helper');
const { defaultLabels } = require('../../config/labels.config');

const initialCommit = async ({
  owner, email, reponame, files
}) => {
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);
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
  await NodeGit.Branch.create(repo, 'master', commit, 1);

  await repoHelper.syncDb(
    [
      {
        repoOwner: owner,
        reponame,
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
  const { id } = repository;
  const newLabels = defaultLabels.map(label => ({ repositoryId: id, ...label }));
  await LabelRepository.bulkCreate(newLabels);

  const initialData = repoHelper.generateInitialData({ ...repoData });
  // Initial data has to contain 'email' (of user) and 'files' in form of [ { filename, content }, {... ]
  if (initialData) {
    await initialCommit({
      owner,
      reponame: name,
      ...initialData
    });
  }

  return {
    ...result,
    id,
    name
  };
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
  const user = await userRepository.getByUsername(owner);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${owner} not found`));
  }
  const repository = await repoRepository.getByUserAndReponame(user.get({ plain: true }).id, reponame);
  if (!repository) {
    return Promise.reject(new CustomError(404, `Repository ${reponame} not found`));
  }
  const branches = await branchRepository.getByRepoId(repository.get({ plain: true }).id);
  /* const branchesNames = branches.map((branch) => {
    const { name } = branch.get({ plain: true });
    return name;
  }); */
  return {
    ...repository.get({ plain: true }),
    branches
  };
};

const updateByUserAndReponame = async ({ owner, reponame, data }) => {
  const user = await userRepository.getByUsername(owner);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${owner} not found`));
  }
  return repoRepository.updateByUserAndReponame(user.id, reponame, data);
};

const deleteByUserAndReponame = async ({ owner, reponame }) => {
  const user = await userRepository.getByUsername(owner);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${owner} not found`));
  }
  return repoRepository.deleteByUserAndReponame(user.id, reponame);
};

const renameRepo = async ({
  reponame, newName, username, orgName
}) => {
  const renameRepository = async (pathName) => {
    try {
      const oldDirectory = repoHelper.getPathToRepo(pathName, reponame);
      const newDirectory = repoHelper.getPathToRepo(pathName, newName);
      fs.renameSync(oldDirectory, newDirectory);
      const result = await updateByUserAndReponame({ owner: pathName, reponame, data: { name: newName } });
      return result;
    } catch (e) {
      return e;
    }
  };

  if (username === orgName) {
    return renameRepository(username);
  }
  return renameRepository(orgName);
};

const deleteRepo = ({ reponame, username, orgName }) => {
  const deleteRepository = async (pathName) => {
    try {
      const directory = repoHelper.getPathToRepo(pathName, reponame);
      await fs.remove(directory);

      const { id: repositoryId } = await getByUserAndReponame({ owner: pathName, reponame });
      await deleteByUserAndReponame({ owner: pathName, reponame });
      await branchRepository.deleteByRepoId(repositoryId);
      await commitRepository.deleteByRepoId(repositoryId);
      return true;
    } catch (e) {
      return e;
    }
  };

  if (username === orgName) {
    deleteRepository(username);
  }
  return deleteRepository(orgName);
};

const getReposNames = async ({
  user: username, isOwner, filter, limit
}) => {
  const user = await userRepository.getByUsername(username);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${username} not found`));
  }
  const findOptions = {
    filter,
    limit,
    sortByCreatedDateDesc: true
  };
  const repos = await repoRepository.getByUserWithOptions(user.id, isOwner, findOptions);
  return repos.map(({ name }) => name);
};

const getReposData = async ({ username, isOwner, userId }) => {
  const user = await userRepository.getByUsername(username);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${username} not found`));
  }
  if (isOwner) {
    return repoRepository.getByUserWithOptions(user.id, isOwner);
  }
  const isOrgOwner = Boolean(await orgUsersRepository.getUserWithOwnerRole({ userId, orgId: user.id }));
  return repoRepository.getByUserWithOptions(user.id, isOrgOwner);
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

    const currentRepoBranches = await branchRepository.getAllRepoBranches(forkedFromRepoId);
    const currentRepoCommits = await commitRepository.getAllRepoCommits(forkedFromRepoId);

    const { id } = await repoRepository.create({
      userId,
      name,
      website,
      description,
      forkedFromRepoId
    });

    const branchesPromises = currentRepoBranches.map(branch => branchRepository.create({ ...branch, repositoryId: id }));
    await Promise.all(branchesPromises);
    const commitPromises = currentRepoCommits.map(commit => commitRepository.create({ ...commit, repositoryId: id }));
    await Promise.all(commitPromises);
    const newLabels = defaultLabels.map(label => ({ repositoryId: id, ...label }));
    await LabelRepository.bulkCreate(newLabels);

    return { status: true, username };
  } catch (err) {
    return Promise.reject(new CustomError(500, err.message));
  }
};

const setStar = async (userId, repositoryId) => {
  const star = await starRepository.getStar(userId, repositoryId);

  const result = star
    ? await starRepository.deleteById(star.id)
    : await starRepository.create({ userId, repositoryId });

  return Number.isInteger(result) ? {} : starRepository.getStar(userId, repositoryId);
};

const getRepoData = async repositoryId => repoRepository.getRepositoryById(repositoryId);

const getRepoOwner = async repositoryId => repoRepository.getRepoOwnerByRepoId(repositoryId);

const getRepositoryCollaborators = repositoryId => collaboratorRepository.getCollaboratorsByRepositoryId(repositoryId);

const getRepositoryForksById = async (repositoryId, level) => {
  const forkLevel = level + 1;
  const forkList = (await repoRepository.getRepositoryForks(repositoryId)).map(fork => fork.get({ plain: true }));

  const forkIds = forkList.map(fork => fork.id);
  const childForkList = await Promise.all(forkIds.map(id => getRepositoryForksById(id, forkLevel)));

  for (let i = 0; i < forkList.length; i += 1) {
    forkList[i].forks = childForkList[i];
  }

  return forkList;
};

const getRepositoryForks = async (repositoryId) => {
  const originalRepositoryId = await repoHelper.getParentRepositoryId(repositoryId);
  const repo = (await getRepoData(originalRepositoryId)).get({ plain: true });
  repo.forks = await getRepositoryForksById(originalRepositoryId, 0);
  return repo;
};

const getAvailableAssigneesByRepoId = async (repositoryId) => {
  const repository = await repoRepository.getById(repositoryId);
  if (!repository) {
    Promise.reject(new CustomError(400, `Repository ${repositoryId} is not found`));
  }
  const { userId } = repository;
  const collaboratorIds = (await collaboratorRepository.getCollaboratorsByRepositoryId(repositoryId)).map(
    collaborator => collaborator.userId
  );
  const orgUsersIds = (await orgUsersRepository.getAllOrganizationUsers(userId)).map(user => user.userId);
  const allIds = orgUsersIds && orgUsersIds.length ? [...collaboratorIds, ...orgUsersIds] : [userId, ...collaboratorIds];
  const assigneeIds = Array.from(new Set(allIds));
  const assignees = await userRepository.getUsersByIds(assigneeIds);
  return assignees.sort((assignee1, assignee2) => assignee2.username < assignee1.username);
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
  updateByUserAndReponame,
  getRepoData,
  getRepositoryCollaborators,
  getRepositoryForks,
  getRepositoryForksById,
  getAvailableAssigneesByRepoId,
  getRepoOwner
};
