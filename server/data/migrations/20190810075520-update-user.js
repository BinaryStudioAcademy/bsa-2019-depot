module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('users', 'name', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    }),
    queryInterface.addColumn('users', 'bio', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    }),
    queryInterface.addColumn('users', 'url', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    }),
    queryInterface.addColumn('users', 'company', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    }),
    queryInterface.addColumn('users', 'location', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    }),
    queryInterface.addColumn('users', 'imgUrl', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.removeColumn('users', 'name', { transaction }),
    queryInterface.removeColumn('users', 'bio', { transaction }),
    queryInterface.removeColumn('users', 'url', { transaction }),
    queryInterface.removeColumn('users', 'company', { transaction }),
    queryInterface.removeColumn('users', 'location', { transaction }),
    queryInterface.removeColumn('users', 'imgUrl', { transaction })
  ]))
};
