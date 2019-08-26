module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const permissions = ['ADMIN', 'WRITE', 'READ'].map(permission => ({
      name: permission,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
