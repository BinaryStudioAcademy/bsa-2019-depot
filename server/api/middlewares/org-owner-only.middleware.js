const UserRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const CustomError = require('../../helpers/error.helper');
const orgRole = require('../../helpers/role.helper');

module.exports = async (req, res, next) => {
  const { orgName } = req.body;
  const userId = req.user.id;

  const { id: orgId } = await UserRepository.getByUsername(orgName);
  const result = await OrgUserRepository.getUserWithOwnerRole({ userId, orgId });
  let userRole;
  if (result) {
    userRole = result.role.name;
  }

  return userRole === orgRole.owner
    ? next()
    : next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`));
};
