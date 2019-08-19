module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rndInd = arr => Math.floor(Math.random() * arr.length);
    const rndIndSet = arr => [...new Set(new Array(rndInd(arr) + 1).fill(0).map(() => rndInd(arr)))];
    const now = new Date();

    const roles = ['OWNER', 'MEMBER'].map(role => ({
      name: role,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('roles', roles);

    const [{ id: ownerRoleId }] = await queryInterface.sequelize.query(
      'SELECT id FROM "roles" WHERE "name"=\'OWNER\';',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const [{ id: memberRoleId }] = await queryInterface.sequelize.query(
      'SELECT id FROM "roles" WHERE "name"=\'MEMBER\';',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const users = await queryInterface.sequelize.query('SELECT id FROM "users" WHERE "type"=\'USER\';', {
      type: Sequelize.QueryTypes.SELECT
    });

    const organizations = await queryInterface.sequelize.query('SELECT id FROM "users" WHERE "type"=\'ORG\';', {
      type: Sequelize.QueryTypes.SELECT
    });

    const orgUserSeed = Array.prototype.concat(
      ...organizations.map(org => rndIndSet(users).map((id, ind) => ({
        userId: users[id].id,
        orgId: org.id,
        roleId: ind ? memberRoleId : ownerRoleId,
        createdAt: now,
        updatedAt: now
      })))
    );

    await queryInterface.bulkInsert('orgUsers', orgUserSeed);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('orgUsers', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
