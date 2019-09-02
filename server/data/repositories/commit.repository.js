const BaseRepository = require('./base.repository');
const {CommitModel} = require('../models/index');

class CommitRepository extends BaseRepository {
  add({...commitData}) {
    return this.create(commitData);
  }

  updateById(id, {...commitData}) {
    return this.updateById(id, commitData);
  }

  getById(id) {
    return this.model.findOne({where: {id}});
  }

  getAllRepoCommits(repositoryId) {
    return this.model.findAll({
      raw: true,
      where: {repositoryId},
      attributes: {
        exclude: ['id']
      }
    });
  }

  getByHash(hash) {
    return this.model.findOne({where: {sha: hash}});
  }

  deleteByRepoId(repositoryId) {
    return this.model.destroy({where: {repositoryId}});
  }
}

module.exports = new CommitRepository(CommitModel);
