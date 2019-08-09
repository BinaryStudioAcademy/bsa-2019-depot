const BaseRepository = require('./base.repository');
const { UserModel } = require('../models/index');

class UserRepository extends BaseRepository {
  addUser({ ...userData }) {
    return this.create(userData);
  }

  setUsernameById(id, username) {
    return this.updateById(id, { username });
  }

  getByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  getByUsername(username) {
    return this.model.findOne({ where: { username } });
  }

  getUserById(id) {
    return this.model.findOne({ where: { id } });
  }
}

module.exports = new UserRepository(UserModel);
