const { Router } = require('express');

const {
  createCommitComment,
  updateCommitComment,
  getCommitCommentsByCommitId,
  deleteCommitComment
} = require('../services/commit-comment.service');

const router = Router();

router.post('/', (req, res, next) => {
  createCommitComment({ ...req.body })
    .then((data) => {
      const { commitId } = data;
      req.commitsNsp.to(commitId).emit('newCommitComment', data);
      return res.send(data);
    })
    .catch(next);
});

router.put('/', (req, res, next) => {
  updateCommitComment({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:commitId', (req, res, next) => {
  const { commitId } = req.params;
  getCommitCommentsByCommitId(commitId)
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/:commentId', (req, res, next) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  deleteCommitComment(commentId, userId)
    .then(() => res.send({ id: commentId }))
    .catch(next);
});

module.exports = router;
