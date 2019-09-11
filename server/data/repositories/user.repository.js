const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const {
  UserModel, IssueModel, PullRequestModel, CommitModel, IssueAssigneeModel
} = require('../models/index');
const cryptoHelper = require('../../helpers/crypto.helper');
const sequelize = require('../db/connection');

const { Op } = Sequelize;

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

  getUsersByIds(ids) {
    return this.model.findAll({ where: { id: ids } });
  }

  getUsersByUsernames(usernames) {
    return this.model.findAll({ where: { username: usernames } });
  }

  async setUserPassword(email, password) {
    const user = (await this.getByEmail(email)).get({ plain: true });
    return this.updateById(user.id, { password: cryptoHelper.encryptSync(password) });
  }

  getUserDetailed(username, isOwner) {
    const literalStatement = isOwner
      ? `
    (SELECT COUNT(*)
    FROM "repositories"
    WHERE "repositories"."userId" = "user"."id"
    AND "repositories"."deletedAt" IS NULL)`
      : `
    (SELECT COUNT(*)
    FROM "repositories"
    WHERE "repositories"."userId" = "user"."id"
    AND "repositories"."isPublic" = true
    AND "repositories"."deletedAt" IS NULL)`;
    return this.model.findOne({
      where: { username },
      attributes: {
        include: [
          [sequelize.literal(literalStatement), 'repositoriesCount'],
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "stars", "repositories"
            WHERE "user"."id" = "stars"."userId"
            AND "repositories"."id" = "stars"."repositoryId"
            AND "stars"."deletedAt" IS NULL
            AND "repositories"."deletedAt" IS NULL)`),
            'starsCount'
          ]
        ]
      }
    });
  }

  findUserByLetter(username) {
    return this.model.findAll({
      where: {
        username: {
          [Op.iLike]: `%${username}%`
        },
        type: 'USER'
      }
    });
  }

  getIssuesAuthors(repositoryId) {
    return this.model.findAll({
      attributes: ['id', 'username', 'imgUrl'],
      include: {
        model: IssueModel,
        where: { repositoryId },
        attributes: []
      }
    });
  }

  getPullsAuthors(repositoryId) {
    return this.model.findAll({
      attributes: ['id', 'username', 'imgUrl'],
      include: {
        model: PullRequestModel,
        where: { repositoryId },
        attributes: []
      }
    });
  }

  getUsersCommits(repositoryId) {
    return this.model.findAll({
      attributes: ['id', 'username', 'imgUrl'],
      include: {
        model: CommitModel,
        where: { repositoryId },
        attributes: ['id', 'createdAt']
      }
    });
  }

  setStatusById(id, status) {
    return this.updateById(id, { status });
  }

  getStatusByUsername(username) {
    return this.model.findOne({
      where: {
        username
      },
      attributes: ['status']
    });
  }

  getIssuesAssignees(repositoryId) {
    return this.model.findAll({
      attributes: ['id', 'username', 'imgUrl'],
      include: {
        model: IssueAssigneeModel,
        required: true,
        include: {
          model: IssueModel,
          where: { repositoryId }
        }
      },
      order: [['username', 'ASC']]
    });
  }
}

module.exports = new UserRepository(UserModel);
