const NodeGit = require('nodegit');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const repoRepository = require('../../data/repositories/repository.repository');
const commitRepository = require('../../data/repositories/commit.repository');
const userRepository = require('../../data/repositories/user.repository');
const pullRepository = require('../../data/repositories/pull-request.repository');
const prStatusRepository = require('../../data/repositories/pr-status.repository');
const pullLabelRepository = require('../../data/repositories/pull-label.repository');
const repoHelper = require('../../helpers/repo.helper');
const CustomError = require('../../helpers/error.helper');

const getDiffCommits = async (pathToRepo, fromBranch, toBranch) => {
  const repo = await NodeGit.Repository.open(pathToRepo);

  const setListeners = headCommit => new Promise((resolve, reject) => {
    const walker = headCommit.history();

    walker.on('end', (commits) => {
      resolve(commits);
    });
    walker.on('error', error => reject(error));

    walker.start();
  });

  const fromBranchCommits = await repo.getBranchCommit(fromBranch).then(setListeners);
  const toBranchCommits = await repo.getBranchCommit(toBranch).then(setListeners);

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

const getBranchDiffs = async (pathToRepo, fromBranch, toBranch) => {
  const getDiffsCommand = `cd ${pathToRepo} && git diff -U1 ${toBranch}...${fromBranch}`;
  const diffsOutput = await exec(getDiffsCommand);

  if (diffsOutput.stderr) {
    throw new Error(diffsOutput.stderr);
  }

  return diffsOutput.stdout;
};

const getPullData = async (repoId, fromBranch, toBranch) => {
  const { userId, name: reponame } = await repoRepository.getById(repoId);
  const { username: owner } = await userRepository.getUserById(userId);
  const pathToRepo = repoHelper.getPathToRepo(owner, reponame);

  const diffs = await getBranchDiffs(pathToRepo, fromBranch, toBranch);
  const commits = await getDiffCommits(pathToRepo, fromBranch, toBranch);

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

const getRepoPulls = async (repositoryId, sort, authorId, title, isOpened) => {
  const status = await prStatusRepository.getByName('OPEN');
  const { id: statusId } = status.get({ plain: true });
  return pullRepository.getPulls(repositoryId, sort, authorId, title, isOpened, statusId);
};

const getPullCount = async (repositoryId, isOpened) => {
  const statusOpen = await prStatusRepository.getByName('OPEN');
  return pullRepository.getPullCount(repositoryId, isOpened, statusOpen);
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
  getPullCount,
  setLabels
};
