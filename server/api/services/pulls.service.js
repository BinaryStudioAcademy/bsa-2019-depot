const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoRepository = require('../../data/repositories/repository.repository');
const commitRepository = require('../../data/repositories/commit.repository');
const userRepository = require('../../data/repositories/user.repository');
const pullRepository = require('../../data/repositories/pull-request.repository');
const prStatusRepository = require('../../data/repositories/pr-status.repository');
const pullLabelRepository = require('../../data/repositories/pull-label.repository');
const pullReviewerRepository = require('../../data/repositories/pull-reviewer.repository');
const repoHelper = require('../../helpers/repo.helper');
const CustomError = require('../../helpers/error.helper');

const getDiffCommits = async (pathToRepo, fromCommitId, toCommitId) => {
  const repo = await NodeGit.Repository.open(pathToRepo);
  const { sha: fromCommitSha } = await commitRepository.getById(fromCommitId);
  const { sha: toCommitSha } = await commitRepository.getById(toCommitId);

  const setListeners = headCommit => new Promise((resolve, reject) => {
    const walker = headCommit.history();

    walker.on('end', (commits) => {
      resolve(commits);
    });
    walker.on('error', error => reject(error));

    walker.start();
  });

  const fromBranchCommits = await repo.getCommit(fromCommitSha).then(setListeners);
  const toBranchCommits = await repo.getCommit(toCommitSha).then(setListeners);

  const fromBranchShas = fromBranchCommits.map(commit => commit.sha());
  const toBranchShas = toBranchCommits.map(commit => commit.sha());

  let filteredShas;
  const commonCommitSha = toBranchShas.find(sha => fromBranchShas.includes(sha));
  if (commonCommitSha) {
    const commonCommitIndex = fromBranchShas.findIndex(sha => sha === commonCommitSha);
    filteredShas = fromBranchShas.slice(0, commonCommitIndex);
  } else {
    filteredShas = fromBranchShas;
  }

  return Promise.all(filteredShas.map(sha => commitRepository.getByHash(sha)));
};

const getBranchDiffs = async (pathToRepo, fromCommitId, toCommitId) => {
  const { sha: fromCommitSha } = await commitRepository.getById(fromCommitId);
  const { sha: toCommitSha } = await commitRepository.getById(toCommitId);

  const getDiffsCommand = `cd ${pathToRepo} && git diff -U1 ${toCommitSha}...${fromCommitSha}`;
  const diffsOutput = await exec(getDiffsCommand);

  if (diffsOutput.stderr) {
    throw new Error(diffsOutput.stderr);
  }

  return diffsOutput.stdout;
};

const getPullData = async (repoId, fromCommitId, toCommitId) => {
  const { userId, name: reponame } = await repoRepository.getById(repoId);
  const { username: owner } = await userRepository.getUserById(userId);
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);

  const diffs = await getBranchDiffs(pathToRepo, fromCommitId, toCommitId);
  const commits = await getDiffCommits(pathToRepo, fromCommitId, toCommitId);

  return {
    diffs,
    commits
  };
};

const mergeBranches = async (id, authorId) => {
  const {
    repository: {
      name: reponame,
      user: { username: repoOwner }
    },
    fromBranch: { name: fromBranchName },
    toBranch: { name: toBranchName },
    number
  } = await pullRepository.getPullById(id);
  const { username: authorUsername, email: authorEmail } = await userRepository.getUserById(authorId);

  const pathToRepo = repoHelper.getPathToRepo(repoOwner, reponame);
  const repo = await NodeGit.Repository.open(pathToRepo);
  const authorSignature = NodeGit.Signature.now(authorUsername, authorEmail);

  const fromHeadCommit = await repo.getBranchCommit(fromBranchName);
  const toHeadCommit = await repo.getBranchCommit(toBranchName);

  const index = await NodeGit.Merge.commits(repo, toHeadCommit, fromHeadCommit, null);
  const mergeCommitTreeId = await index.writeTreeTo(repo);
  const mergeCommitTree = await repo.getTree(mergeCommitTreeId);

  const mergeCommitId = await repo.createCommit(
    `refs/heads/${toBranchName}`,
    authorSignature,
    authorSignature,
    `Merge pull request #${number} from ${repoOwner}/${fromBranchName}`,
    mergeCommitTree,
    [toHeadCommit, fromHeadCommit]
  );

  const mergeCommit = await repo.getCommit(mergeCommitId);

  await repoHelper.syncDb(
    [
      {
        repoOwner,
        reponame,
        sha: mergeCommit.sha(),
        message: mergeCommit.message(),
        userEmail: authorEmail,
        createdAt: new Date()
      }
    ],
    {
      name: toBranchName,
      newHeadSha: mergeCommit.sha()
    }
  );
};

const getPulls = async (repoId) => {
  const pulls = await pullRepository.getRepositoryPulls(repoId);
  return pulls;
};

const addPull = pullData => pullRepository.addPull(pullData);

const getRepoPullByNumber = async (username, reponame, number) => {
  const repoIssue = await pullRepository.getRepoPullByNumber(username, reponame, number);
  return repoIssue || Promise.reject(new CustomError(404, `Pull-request number ${number} not found`));
};

const updatePullById = ({ id, ...pullData }) => pullRepository.updatePullById(id, pullData);

const closePullById = async (id) => {
  const status = await prStatusRepository.getByName('CLOSED');
  const { id: statusId } = status.get({ plain: true });
  return pullRepository.setStatusById(id, statusId);
};

const reopenPullById = async (id) => {
  const status = await prStatusRepository.getByName('OPEN');
  const { id: statusId } = status.get({ plain: true });
  return pullRepository.setStatusById(id, statusId);
};

const mergePullById = async (id, userId) => {
  await mergeBranches(id, userId);

  const status = await prStatusRepository.getByName('MERGED');
  const { id: statusId } = status.get({ plain: true });
  return pullRepository.setStatusById(id, statusId);
};

const getAuthorId = pullId => pullRepository.getAuthorId(pullId);

const getRepoOwnerId = pullId => pullRepository.getRepoOwnerId(pullId);

const getRepoByPullId = pullId => pullRepository.getRepoByPullId(pullId);

const addPullStatuses = async (pullsObjects) => {
  const pulls = pullsObjects.map(pull => pull.get({ plain: true }));
  const pullsReviews = await Promise.all(pulls.map(({ id }) => pullReviewerRepository.getReviewersForPull(id)));

  const statuses = pullsReviews.map((reviewObjs) => {
    if (!reviewObjs.length) {
      return '';
    }

    const reviews = reviewObjs.map(review => review.get({ plain: true }));

    reviews.sort(({ updatedAt: updatedAtA }, { updatedAt: updatedAtB }) => new Date(updatedAtB) - new Date(updatedAtA));
    const approvedId = reviews.findIndex(review => review.status.name === 'APPROVED');
    const changesRequestedId = reviews.findIndex(review => review.status.name === 'CHANGES REQUESTED');
    if (approvedId === -1 && changesRequestedId === -1) {
      return 'Review required';
    }
    if (approvedId > changesRequestedId) {
      return 'Approved';
    }
    return 'Requested changes';
  });

  return pulls.map((pull, index) => ({ ...pull, reviewStatus: statuses[index] }));
};

const getRepoPulls = async (repositoryId, sort, authorId, title, isOpened) => {
  const status = await prStatusRepository.getByName('OPEN');
  const { id: statusOpenedId } = status.get({ plain: true });
  const pullsObjects = await pullRepository.getPulls({
    repositoryId,
    sort,
    userId: authorId,
    title,
    isOpened,
    statusOpenedId
  });
  return addPullStatuses(pullsObjects);
};

const getUserPulls = async (params) => {
  const { id: statusOpenedId } = await prStatusRepository.getByName('OPEN');
  const pullsObjects = await pullRepository.getPulls({ ...params, statusOpenedId });
  return addPullStatuses(pullsObjects);
};

const getAllPullsOwners = userId => pullRepository.getAllPullsOwners(userId);

const getPullCount = async (params) => {
  const { id: statusOpenedId } = await prStatusRepository.getByName('OPEN');
  return pullRepository.getPullCount({ ...params, statusOpenedId });
};

const setLabels = async (labelIds, pullId) => {
  const currentPullLabelIds = (await pullLabelRepository.getLabelsByPR(pullId)).map(pullLabel => pullLabel.labelId);
  const toAddIds = labelIds.filter(labelId => !currentPullLabelIds.includes(labelId));
  const toDeleteIds = currentPullLabelIds.filter(labelId => !labelIds.includes(labelId));
  toAddIds.forEach(labelId => pullLabelRepository.create({ labelId, pullId }));
  toDeleteIds.forEach(labelId => pullLabelRepository.deleteByLabelAndPullId(labelId, pullId));
};

module.exports = {
  getPulls,
  addPull,
  getPullData,
  getRepoPullByNumber,
  updatePullById,
  closePullById,
  getAuthorId,
  getRepoOwnerId,
  reopenPullById,
  mergePullById,
  getRepoByPullId,
  getRepoPulls,
  getAllPullsOwners,
  getUserPulls,
  getPullCount,
  setLabels
};
