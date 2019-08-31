const collaboratorService = require('../api/services/collaborator.service');
const issueService = require('../api/services/issue.service');
const permissionLevel = require('../helpers/permission.level.helper');

const checkPermissions = async (issueId, userId) => {
  const { repository: { id: repositoryId } } = await issueService.getRepoByIssueId(issueId);
  const [collaborator] = await collaboratorService.getUserRightsByUserIdAndRepositoryId(userId, repositoryId);
  let permissionName;
  if(collaborator) {
    permissionName = collaborator.permission.name;
  }
  return Boolean(permissionName === (permissionLevel.admin || permissionLevel.write));
};

module.exports = { checkPermissions };