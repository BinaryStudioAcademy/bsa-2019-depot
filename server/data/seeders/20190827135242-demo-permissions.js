module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const permissions = [
      {
        name: 'ADMIN',
        description:
          'Can read, clone and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
      },
      {
        name: 'WRITE',
        description: 'Can read and clone this repository. Can also manage issues and pull requests.'
      },
      {
        name: 'READ',
        description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
      }
    ].map(permission => ({
      ...permission,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
