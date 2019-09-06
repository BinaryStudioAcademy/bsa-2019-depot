const { Router } = require('express');
const pullCommentService = require('../services/pull-comment.service');

const router = Router();

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  pullCommentService.getPullCommentById(id)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { pullId, userId, comment: body } = req.body;
  pullCommentService.addPullComment({ userId, pullId, body })
    .then((data) => {
      const { pullId: id } = data;
      req.pullsNsp.to(id).emit('newPullComment', data);
      return res.send(data);
    })
    .catch(next);
});

router.put('/', (req, res, next) => {
  const { id, comment: body } = req.body;
  const { id: userId } = req.user;
  pullCommentService.updatePullCommentById(id, userId, { body })
    .then((data) => {
      const { pullId } = data;
      req.pullsNsp.to(pullId).emit('changedPullComments');
      return res.send(data);
    })
    .catch(next);
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const comment = await pullCommentService.getPullCommentById(id);
  const { pullId } = comment.get({ plain: true });
  pullCommentService.deletePullCommentById(id, userId)
    .then(() => {
      req.pullsNsp.to(pullId).emit('changedPullComments');
      res.sendStatus(200);
    })
    .catch(next);
});

module.exports = router;
