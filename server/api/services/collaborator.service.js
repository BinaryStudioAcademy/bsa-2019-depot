const userRepository = require('../../data/repositories/user.repository');

const { sendInviteCollaboratorEmail } = require('./email.service');

const addCollaborator = async ({ userId, repositoryId, url, permission }) => {
  // await sendInviteCollaboratorEmail({ email, url, username, reponame });
};

module.exports = {
  addCollaborator
};
