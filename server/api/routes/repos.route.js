const { Router } = require('express');
const issueService = require('../services/issue.service');

const router = Router();

router.get('/:repositoryId/issues', (req, res, next) => {
  const { repositoryId } = req.params;
  const { sort, author, title } = req.query;
  issueService
    .getRepoIssues({
      repositoryId,
      sort,
      author,
      title
    })
    .then(result => res.send(result))
    .catch(next);
});

module.exports = router;
