const { Router } = require('express');
const pullService = require('../services/pulls.service');
const pullCommentService = require('../services/pull-comment.service');
const { checkPullPermissions } = require('../../helpers/check.permission.level.helper');

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

router.put('/', (req, res, next) => {
  pullService
    .updatePullById({ ...req.body })
    .then(data => res.send({ data }))
    .catch(next);
});

router.put('/:id/close', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const authorId = await pullService.getAuthorId(id);
  const repoOwnerId = await pullService.getRepoOwnerId(id);
  const isAccessGranted = checkPullPermissions(id, userId);
  if (userId !== authorId && userId !== repoOwnerId && !isAccessGranted) {
    res.status(401).send('Only pull-request author or repo owner can close it');
    return;
  }

  pullService
    .closePullById(id)
    .then(([, data]) => res.send(data))
    .catch(next);
});

router.put('/:id/reopen', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const authorId = await pullService.getAuthorId(id);
  const repoOwnerId = await pullService.getRepoOwnerId(id);
  const isAccessGranted = checkPullPermissions(id, userId);
  if (userId !== authorId && userId !== repoOwnerId && !isAccessGranted) {
    res.status(401).send('Only pull-request author or repo owner can reopen it');
    return;
  }

  pullService
    .reopenPullById(id)
    .then(([, data]) => res.send(data))
    .catch(next);
});

router.put('/:id/merge', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const authorId = await pullService.getAuthorId(id);
  const repoOwnerId = await pullService.getRepoOwnerId(id);
  const isAccessGranted = checkPullPermissions(id, userId);
  if (userId !== authorId && userId !== repoOwnerId && !isAccessGranted) {
    res.status(401).send('Only pull-request author or repo owner can merge it');
    return;
  }

  pullService
    .mergePullById(id)
    .then(([, data]) => res.send(data))
    .catch(next);
});

module.exports = router;
