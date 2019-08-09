const Sequelize = require('sequelize');
const config = require('../../config/db.config');

const sequelize = new Sequelize(config);

sequelize.authenticate().catch((err) => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
