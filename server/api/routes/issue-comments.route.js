const { Router } = require('express');
const { addIssueComment } = require('../services/issue.service');

const router = Router();

router.post('/', (req, res, next) => {
  const { issueId, userId, comment: body } = req.body;

  addIssueComment({ userId, issueId, body })
    .then((data) => {
      req.issuesNsp.emit('testEventFromRoute', data); // event emitted, but can't be catch on client. Why???
      return res.send({
        status: true
      });
    })
    .catch(next);
});

module.exports = router;
