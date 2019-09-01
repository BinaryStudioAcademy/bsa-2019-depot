import { getUserRights } from '../services/permissionService';

export const getUserPermissions = async (username, reponame, userId) => {
  const userPermissions = (await getUserRights(username, reponame, userId))[0];
  let accessPermissions;
  if (userPermissions) {
    accessPermissions = userPermissions.permission.name;
  }
  return Boolean(accessPermissions === ('ADMIN' || 'WRITE'));
};
