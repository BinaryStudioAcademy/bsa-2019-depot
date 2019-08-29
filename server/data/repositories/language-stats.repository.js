const BaseRepository = require('./base.repository');
const { LanguageStatsModel, LanguageModel } = require('../models/index');

class LanguageStatsRepository extends BaseRepository {
  getByBranchId(branchId) {
    return this.model.findAll({
      where: { branchId },
      include: [
        {
          model: LanguageModel,
          attributes: ['name', 'color']
        }
      ],
      order: [['percentage', 'DESC']]
    });
  }

  deleteByBranchId(branchId) {
    return this.model.destroy({ where: { branchId } });
  }
}

module.exports = new LanguageStatsRepository(LanguageStatsModel);
