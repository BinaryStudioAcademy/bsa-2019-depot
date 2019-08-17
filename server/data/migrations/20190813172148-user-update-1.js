module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('users', 'type', {
      allowNull: false,
      type: Sequelize.TEXT,
      unique: false,
      defaultValue: 'USER'
    }),
    queryInterface.addColumn('users', 'fake', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      unique: false,
      defaultValue: false
    })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.removeColumn('users', 'type', { transaction }),
    queryInterface.removeColumn('users', 'fake', { transaction })
  ]))
};
