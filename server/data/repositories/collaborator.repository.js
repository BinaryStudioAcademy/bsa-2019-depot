const BaseRepository = require('./base.repository');
const { CollaboratorModel } = require('../models/index');

class CollaboratorRepository extends BaseRepository {
  findRepoById(id) {
    return this.model.findAll({
      where: { id }
    });
  }
}

module.exports = new CollaboratorRepository(CollaboratorModel);
