const collaboratorService = require('../api/services/collaborator.service');
const commitService = require('../api/services/commit.service');
const issueService = require('../api/services/issue.service');
const pullService = require('../api/services/pulls.service');
const permissionLevel = require('../helpers/permission.level.helper');

const checkIssuePermissions = async (issueId, userId) => {
  const {
    repository: { id: repositoryId }
  } = await issueService.getRepoByIssueId(issueId);
  const [collaborator] = await collaboratorService.getUserRightsByUserIdAndRepositoryId(userId, repositoryId);
  let permissionName;
  if (collaborator) {
    permissionName = collaborator.permission.name;
  }
  return Boolean(permissionName === (permissionLevel.admin || permissionLevel.write));
};

const checkCommitCommentPermissions = async (commitId, userId) => {
  const {
    repository: { id: repositoryId }
  } = await commitService.getRepoByCommitId(commitId);
  const [collaborator] = await collaboratorService.getUserRightsByUserIdAndRepositoryId(userId, repositoryId);
  let permissionName;
  if (collaborator) {
    permissionName = collaborator.permission.name;
  }
  return Boolean(permissionName === (permissionLevel.admin || permissionLevel.write));
};

const checkPullPermissions = async (pullId, userId) => {
  const { repository: { id: repositoryId } } = await pullService.getRepoByPullId(pullId);
  const [collaborator] = await collaboratorService.getUserRightsByUserIdAndRepositoryId(userId, repositoryId);
  let permissionName;
  if (collaborator) {
    permissionName = collaborator.permission.name;
  }
  return Boolean(permissionName === (permissionLevel.admin || permissionLevel.write));
};

module.exports = {
  checkIssuePermissions,
  checkCommitCommentPermissions,
  checkPullPermissions
};
