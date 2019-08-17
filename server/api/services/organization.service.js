const userRepository = require('../../data/repositories/user.repository');

const createOrganization = async (data) => {
  const { username } = data;
  const found = await userRepository.getByUsername(username);

  if (found) {
    return { status: false, error: 'such profile name already exists' };
  }

  return {
    profile: await userRepository.addUser({ ...data, type: 'ORG', fake: false }),
    status: true
  };
};

module.exports = {
  createOrganization
};
