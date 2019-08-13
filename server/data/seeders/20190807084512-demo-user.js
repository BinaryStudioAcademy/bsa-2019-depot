const usersSeed = require('../seed-data/users.seed');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rndInd = arr => Math.floor(Math.random() * arr.length);
    const rndIndSet = arr => [...new Set(new Array(rndInd(arr) + 1).fill(0).map(() => rndInd(arr)))];
    const now = new Date();

    await queryInterface.bulkInsert('users', usersSeed);

    const users = await queryInterface.sequelize.query('SELECT id FROM "users" WHERE "type"=\'USER\';', {
      type: Sequelize.QueryTypes.SELECT
    });

    const organizations = await queryInterface.sequelize.query('SELECT id FROM "users" WHERE "type"=\'ORG\';', {
      type: Sequelize.QueryTypes.SELECT
    });

    const orgUserSeed = Array.prototype.concat(
      ...organizations.map(org => rndIndSet(users).map(id => ({
        userId: users[id].id,
        orgId: org.id,
        createdAt: now,
        updatedAt: now
      })))
    );

    await queryInterface.bulkInsert('orgUsers', orgUserSeed);
  },

  down: async (queryInterface /* Sequelize */) => {
    try {
      await queryInterface.bulkDelete('users', null, {});
      await queryInterface.bulkDelete('orgUsers', null, {});
    } catch (err) {
      // console.log(`Seeding error: ${err}`);
    }
  }
};
