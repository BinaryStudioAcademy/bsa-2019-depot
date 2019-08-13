const userRepository = require('../../data/repositories/user.repository');

const createOrganization = async data => userRepository.addUser({ ...data, type: 'ORG', fake: false });

module.exports = {
  createOrganization
};
