const BaseRepository = require('./base.repository');
const PRStatusRepository = require('./pr-status.repository');
const {
  PullRequestModel, UserModel, RepositoryModel, PRStatusModel
} = require('../models/index');

class PullRepository extends BaseRepository {
  getMaxIssueRepoNumber(repositoryId) {
    return this.model.max('number', {
      where: { repositoryId },
      paranoid: false
    });
  }

  async addPull({ ...pullData }) {
    const { repositoryId } = pullData;
    const number = ((await this.getMaxIssueRepoNumber(repositoryId)) || 0) + 1;
    const status = (await PRStatusRepository.getByName('OPEN')).id;
    const pullDataWithNumber = {
      ...pullData,
      statusId: status,
      number
    };
    return this.create(pullDataWithNumber);
  }

  getRepositoryPulls(repositoryId) {
    return this.model.findAll({
      where: { repositoryId },
      include: [
        {
          model: UserModel,
          attributes: ['username']
        },
        {
          model: RepositoryModel,
          attributes: ['name']
        },
        {
          model: PRStatusModel,
          attributes: ['name']
        }
      ]
    });
  }
}

module.exports = new PullRepository(PullRequestModel);
