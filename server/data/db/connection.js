const Sequelize = require('sequelize');
const config = require('../../config/db.config');

const sequelize = new Sequelize(config);

sequelize
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
