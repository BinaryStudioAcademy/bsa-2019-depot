import { getUserRights } from '../services/permissionService';

export const getAdminUserPermissions = async (username, reponame, userId) => {
  const userPermissions = (await getUserRights(username, reponame, userId))[0];
  if (!userPermissions) {
    return false;
  }
  if (userPermissions.role) {
    return userPermissions.role.name === 'OWNER';
  }
  return userPermissions.permission.name === 'ADMIN';
};

export const getOwnerUserPermissions = async (username, reponame, userId) => {
  const userPermissions = (await getUserRights(username, reponame, userId))[0];
  if (!userPermissions) {
    return false;
  }
  if (userPermissions.role) {
    return userPermissions.role.name === 'OWNER';
  }
  return false;
};

export const getWriteUserPermissions = async (username, reponame, userId) => {
  const userPermissions = (await getUserRights(username, reponame, userId))[0];
  if (!userPermissions) {
    return false;
  }
  if (userPermissions.role) {
    return userPermissions.role.name === 'OWNER';
  } else {
    return userPermissions.permission.name === 'ADMIN' || userPermissions.permission.name === 'WRITE';
  }
};

export const getAllUserPermissions = async (username, reponame, userId) => {
  const userPermissions = (await getUserRights(username, reponame, userId))[0];
  return Boolean(userPermissions);
};
