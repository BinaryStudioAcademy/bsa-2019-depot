module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const statuses = ['PENDING', 'COMMENTED', 'APPROVED', 'CHANGES REQUESTED'].map(status => ({
      name: status,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('reviewStatuses', statuses);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('reviewStatuses', null, {});
  }
};
