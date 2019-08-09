const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const Repository = orm.import('./repository');

associate({
  User,
  Repository
});

module.exports = {
  UserModel: User,
  RepositoryModel: Repository
};
