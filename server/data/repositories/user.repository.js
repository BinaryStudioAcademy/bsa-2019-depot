const BaseRepository = require('./base.repository');
const { UserModel } = require('../models/index');
const cryptoHelper = require('../../helpers/crypto.helper');
const sequelize = require('../db/connection');

class UserRepository extends BaseRepository {
  addUser({ ...userData }) {
    return this.create(userData);
  }

  updateUserById(id, { ...userData }) {
    return this.updateById(id, userData);
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

  getUserDetailed(username) {
    return this.model.findOne({
      where: { username },
      attributes: {
        include: [
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "repositories"
            WHERE "repositories"."userId" = "user"."id")`),
            'repositoriesCount'
          ],
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "stars"
            WHERE "user"."id" = "stars"."userId")`),
            'starsCount'
          ]
        ]
      }
    });
  }
}

module.exports = new UserRepository(UserModel);
