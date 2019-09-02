const { Router } = require('express');
const pullService = require('../services/pulls.service');
const pullCommentService = require('../services/pull-comment.service');

const router = Router();

router.post('/', (req, res, next) => {
  pullService
    .addPull({ ...req.body })
    .then(data => res.send({ data }))
    .catch(next);
});

router.get('/:pullId/comments', (req, res, next) => {
  const { pullId } = req.params;
  pullCommentService
    .getAllPullComments(pullId)
    .then(data => res.send({ data }))
    .catch(next);
});

module.exports = router;
