const { Router } = require('express');
const issueService = require('../services/issue.service');
const { getRepoIssueByNumber } = require('../services/issue.service');

const router = Router();

router.get('/:repositoryId/issues', (req, res, next) => {
  const { repositoryId } = req.params;
  const { sort, author, title } = req.query;
  issueService
    .getRepoIssues(repositoryId, sort, author, title)
    .then(result => res.send(result))
    .catch(next);
});

router.get('/:reponame/issues/:number', (req, res, next) => {
  const { reponame, number } = req.params;
  getRepoIssueByNumber(reponame, number)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
