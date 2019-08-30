
      include: [{
        model: RepositoryModel,
        attributes: [],
        required: true,
        include: [{
    });
  }

  getRepoIssueByNumber(username, reponame, number) {
    return this.model.findOne({
      where: { number },
      include: [
        {
          model: RepositoryModel,
          attributes: [],
          where: { name: reponame },
          include: [
            {
              model: UserModel,
              attributes: [],
              where: { username }
            }
          ]
        },
        {
          model: UserModel,
          attributes: ['username']
        }
      ]
    });
  }
}

module.exports = new IssueRepository(IssueModel);
