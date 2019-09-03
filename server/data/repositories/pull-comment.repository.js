const BaseRepository = require('./base.repository');
const { PullCommentModel, UserModel } = require('../models/index');

class PullCommentRepository extends BaseRepository {
  addPullComment(data) {
    return this.create(data).then((newComment) => {
      const { id } = newComment.get({ plain: true });
      return this.model.findOne({
        where: { id },
        include: [
          {
            model: UserModel
          }
        ]
      });
    });
  }

  async updatePullCommentById(id, commentData) {
    const [, data] = await this.model.update(commentData, {
      where: { id },
      returning: true,
      plain: true
    });

    return data;
  }

  getPullComments(pullId) {
    return this.model.findAll({
      where: { pullId },
      include: [
        {
          model: UserModel,
          attributes: ['username', 'imgUrl']
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

module.exports = new PullCommentRepository(PullCommentModel);
