const { Router } = require('express');
const { addIssue, getAllIssueComments } = require('../services/issue.service');

const router = Router();

router
  .post('/', (req, res, next) => {
    const {
      userId, repositoryId, title, body, isOpened
    } = req.body;
    addIssue({
      userId,
      repositoryId,
      title,
      body,
      isOpened
    })
      .then(() => res.send({
        status: true
      }))
      .catch(next);
  })
  .get('/:issueId/comments', (req, res, next) => {
    const { issueId } = req.params;
    getAllIssueComments({ issueId })
      .then(result => res.send(result))
      .catch(next);
  });

module.exports = router;
