const BaseRepository = require('./base.repository');
const { PullReviewerModel, ReviewStatusModel, UserModel } = require('../models/index');

class PullReviewerRepository extends BaseRepository {
  getReviewersForPull(pullId) {
    return this.model.findAll({
      where: { pullId },
      include: [
        {
          model: ReviewStatusModel,
          as: 'status'
        },
        {
          model: UserModel
        }
      ]
    });
  }

  getByUserAndPull(userId, pullId) {
    return this.model.findOne({
      where: { userId, pullId },
      include: [
        {
          model: ReviewStatusModel,
          as: 'status'
        },
        {
          model: UserModel
        }
      ]
    });
  }

  updateByUserAndPull(userId, pullId, data) {
    return this.model.update(data, { where: { userId, pullId } });
  }
}

module.exports = new PullReviewerRepository(PullReviewerModel);
