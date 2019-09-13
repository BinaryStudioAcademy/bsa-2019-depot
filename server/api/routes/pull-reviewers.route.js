const { Router } = require('express');
const pullReviewerService = require('../services/pull-reviewer.service');

const router = Router();

router.post('/', (req, res, next) => {
  const { userId, pullId } = req.body;
  pullReviewerService
    .addReviewer(pullId, userId)
    .then(data => res.send(data))
    .catch(next);
});

router.put('/', (req, res, next) => {
  const { userId, pullId, status } = req.body;
  pullReviewerService
    .updateReviewStatus(userId, pullId, status)
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/:reviewerId', (req, res, next) => {
  const { reviewerId } = req.params;
  pullReviewerService
    .removeReviewer(reviewerId)
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.get('/available/:repositoryId/:pullAuthorId', (req, res, next) => {
  const { repositoryId, pullAuthorId } = req.params;
  pullReviewerService
    .getAvailableReviewers(repositoryId, pullAuthorId)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
