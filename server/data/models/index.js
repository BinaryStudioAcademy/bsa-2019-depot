const orm = require('../db/connection');
// const associate = require('../db/associations');

const User = orm.import('./user');

// associate({
//  User
// });

module.exports = {
  UserModel: User
};
