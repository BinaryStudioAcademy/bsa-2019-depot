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
}

module.exports = new PullReviewerRepository(PullReviewerModel);
