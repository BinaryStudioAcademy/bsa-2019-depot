const UserRepository = require('../../data/repositories/user.repository');
const StarRepository = require('../../data/repositories/star.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');
const RepoRepository = require('../../data/repositories/repository.repository');
const CustomError = require('../../helpers/error.helper');
const tokenHelper = require('../../helpers/token.helper');

const getUserById = async (userId) => {
  const user = await UserRepository.getUserById(userId);
  return user || Promise.reject(new CustomError(404, `User with id ${userId} not found`));
};

const getUsersOrganizations = userId => OrgUserRepository.getUsersOrganizations(userId);

const getUserDetailed = async (username, isOwner) => {
  const user = await UserRepository.getUserDetailed(username, isOwner);
  return user || Promise.reject(new CustomError(404, `User ${username} not found`));
};

const getUserByUsername = async (username) => {
  const user = await UserRepository.getByUsername(username);
  return user || Promise.reject(new CustomError(404, `User ${username} not found`));
};

const setUsername = async ({ id, username }) => {
  const data = await UserRepository.setUsernameById(id, username);
  return {
    ...data
  };
};

const checkUsernameExists = async ({ username }) => {
  const user = await UserRepository.getByUsername(username.toLowerCase());
  return {
    usernameExists: Boolean(user)
  };
};

const resetPassword = async ({ token, password }) => {
  const result = { status: 200, message: 'Password updated' };
  const authorizedData = await tokenHelper.verifyToken(token);
  if (!authorizedData) {
    return Promise.reject(new CustomError(401, 'Incorrect token'));
  }
  await UserRepository.setUserPassword(authorizedData.data, password);
  return result;
};

const updateUserSettings = async ({ id, settings }) => {
  const {
    name, bio, url, company, location, imgUrl, deviceToken
  } = settings;
  const data = await UserRepository.updateUserById(id, {
    name,
    bio,
    url,
    company,
    location,
    imgUrl,
    deviceToken
  });
  return {
    ...data
  };
};

const getStars = async username => StarRepository.getStars(username);

const uploadPhoto = async ({ id, imgUrl }) => {
  await UserRepository.updateUserById(id, {
    imgUrl
  });
  const data = await UserRepository.getById(id);
  return data;
};

const deletePhoto = async ({ id }) => {
  await UserRepository.updateUserById(id, {
    imgUrl: null
  });
  const data = await UserRepository.getById(id);
  return data;
};

const getUsersToInviting = async ({ orgID, username }) => {
  const allUsers = await UserRepository.findUserByLetter(username);
  const orgUsers = await OrgUserRepository.getAllOrganizationUsers(orgID);
  const usersIdInOrg = orgUsers.map(({ userId }) => userId);

  const users = allUsers.filter(({ id }) => !usersIdInOrg.includes(id)).slice(0, 6);
  const usernames = users.map(user => user.username);
  return usernames;
};

const getUsersForCollaboratorsAddition = async ({ username, repositoryId, userId }) => {
  const users = (await UserRepository.findUserByLetter(username)).filter(({ id }) => id !== userId);

  const repos = (await CollaboratorRepository.findRepoById(repositoryId)).map(data => data.userId);
  const {
    user: { username: owner }
  } = await RepoRepository.getRepoOwnerByRepoId(repositoryId);
  return users
    .filter(({ id }) => !repos.includes(id))
    .map(({ username: name }) => name)
    .filter(name => name !== owner)
    .slice(0, 6);
};

const getIssuesAuthors = async repositoryId => UserRepository.getIssuesAuthors(repositoryId);

const getPullsAuthors = async repositoryId => UserRepository.getPullsAuthors(repositoryId);
const getIssuesAssignees = async repositoryId => UserRepository.getIssuesAssignees(repositoryId);

const setStatus = async (userId, status) => UserRepository.setStatusById(userId, status);

const getStatus = async username => UserRepository.getStatusByUsername(username);

module.exports = {
  getUserById,
  getUserByUsername,
  setUsername,
  checkUsernameExists,
  updateUserSettings,
  resetPassword,
  getUserDetailed,
  getStars,
  getUsersToInviting,
  getUsersOrganizations,
  getUsersForCollaboratorsAddition,
  uploadPhoto,
  deletePhoto,
  getIssuesAuthors,
  getPullsAuthors,
  setStatus,
  getStatus,
  getIssuesAssignees
};
