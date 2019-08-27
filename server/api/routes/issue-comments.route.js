const { Router } = require('express');
const { addIssueComment } = require('../services/issue.service');

const router = Router();

router.post('/', (req, res, next) => {
  const { issueId, userId, comment: body } = req.body;
  addIssueComment({ userId, issueId, body })
    .then(() => res.send({
      status: true
    }))
    .catch(next);
});

module.exports = router;
