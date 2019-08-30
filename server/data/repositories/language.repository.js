const BaseRepository = require('./base.repository');
const { LanguageModel } = require('../models/index');

class LanguageRepository extends BaseRepository {
  getByName(name) {
    return this.model.findOne({ where: { name } });
  }
}

module.exports = new LanguageRepository(LanguageModel);
