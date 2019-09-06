module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const roles = ['OWNER', 'MEMBER'].map(role => ({
      name: role,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('roles', roles);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
