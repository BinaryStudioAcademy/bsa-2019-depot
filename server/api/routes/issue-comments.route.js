const { Router } = require('express');
const { addIssueComment } = require('../services/issue.service');

const router = Router();

router.post('/', (req, res, next) => {
  const { issueId, userId, comment: body } = req.body;

  addIssueComment({ userId, issueId, body })
    .then((data) => {
      const { issueId } = data;
      req.issuesNsp.to(issueId).emit('newIssueComment', data);
      return res.send(data);
    })
    .catch(next);
});

module.exports = router;
