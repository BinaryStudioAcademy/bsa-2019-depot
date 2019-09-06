module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const statuses = ['OPEN', 'CLOSED', 'MERGED'].map(role => ({
      name: role,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('prstatuses', statuses);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('prstatuses', null, {});
  }
};
