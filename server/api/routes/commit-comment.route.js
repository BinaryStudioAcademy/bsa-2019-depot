const { Router } = require('express');

const { createCommitComment, getCommitCommentsByCommitId } = require('../services/commit-comment.service');

const router = Router();

router.post('/', (req, res, next) => {
  createCommitComment({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:commitId', (req, res, next) => {
  const { commitId } = req.params;
  getCommitCommentsByCommitId(commitId)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
