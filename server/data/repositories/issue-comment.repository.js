const BaseRepository = require('./base.repository');
const { IssueCommentModel, UserModel } = require('../models/index');

class IssueCommentRepository extends BaseRepository {
  addIssueComment({ ...issueCommentData }) {
    return this.create(issueCommentData);
  }

  async updateIssueCommentById(id, issueCommentData) {
    const [, data] = await this.model.update(issueCommentData, {
      where: { id },
      returning: true,
      plain: true
    });

    return data;
  }

  deleteIssueCommentById(id) {
    return this.deleteById(id);
  }

  getAllIssueComments({ issueId }) {
    return this.model.findAll({
      where: { issueId },
      include: [
        {
          model: UserModel,
          attributes: ['username']
        }
      ],
      order: [['createdAt', 'ASC']]
    });
  }

  async getAuthorId(id) {
    const comment = await this.model.findOne({ where: { id } });
    const { userId: authorId } = comment.get({ plain: true });
    return authorId;
  }
}

module.exports = new IssueCommentRepository(IssueCommentModel);
