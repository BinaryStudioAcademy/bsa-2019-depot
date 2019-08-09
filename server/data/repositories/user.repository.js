const BaseRepository = require('./base.repository');
const { UserModel } = require('../models/index');
const cryptoHelper = require('../../helpers/crypro.helper');

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

  async setUserPassword(email, password) {
    const user = await this.getByEmail(email);
    return this.updateById(user.dataValues.id, { password: cryptoHelper.encryptSync(password) });
  }
}

module.exports = new UserRepository(UserModel);
