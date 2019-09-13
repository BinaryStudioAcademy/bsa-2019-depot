const { Router } = require('express');
const admin = require('firebase-admin');
const pullService = require('../services/pulls.service');
const repoService = require('../services/repo.service');
const pullCommentService = require('../services/pull-comment.service');
const pullReviewerService = require('../services/pull-reviewer.service');
const { checkPullPermissions } = require('../../helpers/check.permission.level.helper');

const router = Router();

router.post('/', (req, res, next) => {
  const { repositoryId } = req.body;
  repoService.getRepoOwner(repositoryId).then((data) => {
    const token = data.get({ plain: true }).user.deviceToken;
    if (token) {
      const message = {
        notification: {
          title: 'New pull request',
          body: 'You have a new pull request. Check out the app'
        },
        token
      };
      admin
        .messaging()
        .send(message)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Error sending message:', error);
        });
    }
  });
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

router.get('/:pullId/reviewers', (req, res, next) => {
  const { pullId } = req.params;
  pullReviewerService
    .getReviewersForPull(pullId)
    .then(data => res.send(data))
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
    .mergePullById(id, userId)
    .then(([, data]) => res.send(data))
    .catch(next);
});

module.exports = router;
