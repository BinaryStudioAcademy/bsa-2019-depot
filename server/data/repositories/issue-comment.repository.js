const BaseRepository = require('./base.repository');
const { IssueCommentModel, UserModel } = require('../models/index');

class IssueCommentRepository extends BaseRepository {
  addIssueComment({ ...issueCommentData }) {
    return this.create(issueCommentData).then((data) => {
      const { id } = data.get({ plain: true });
      return this.model.findOne({
        where: { id },
        include: [
          {
            model: UserModel,
            attributes: ['username']
          }
        ]
      });
    });
  }

  updateIssueCommentById(id, { ...issueCommentData }) {
    return this.updateById(id, issueCommentData);
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
      ]
    });
  }
}

module.exports = new IssueCommentRepository(IssueCommentModel);
