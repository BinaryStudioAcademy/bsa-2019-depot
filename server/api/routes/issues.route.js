const { Router } = require('express');
const admin = require('firebase-admin');
const issueService = require('../services/issue.service');
const issueCommentService = require('../services/issue-comment.service');
const userService = require('../services/user.service');
const issueAssigneeService = require('../services/issue-assignee.service');
const { checkIssuePermissions } = require('../../helpers/check.permission.level.helper');

const router = Router();

router
  .post('/', (req, res, next) => {
    const {
      userId, repositoryId, title, body, username
    } = req.body;
    userService.getUserDetailed(username).then((data) => {
      const token = data.get({ plain: true }).deviceToken;
      if (token) {
        const message = {
          notification: {
            title: `New issue: ${title}`,
            body
          },
          token
        };
        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
      }
    });

    issueService
      .addIssue({
        userId,
        repositoryId,
        title,
        body,
        isOpened: true
      })
      .then(data => res.send({
        data
      }))
      .catch(next);
  })
  .put('/', async (req, res, next) => {
    const { id, title, body } = req.body;

    if (!id) {
      res.status(400).send('No issueId specified');
      return;
    }

    const userId = req.user.id;
    const authorId = await issueService.getAuthorId(id);
    const isAccessGranted = checkIssuePermissions(id, userId);

    if (userId !== authorId && !isAccessGranted) {
      res.status(401).send('Only issue author can update it');
      return;
    }

    issueService
      .updateIssueById({
        id,
        title,
        body
      })
      .then(([, data]) => res.send(data))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const { id } = req.params;

    issueService
      .getIssueById(id)
      .then(result => res.send(result))
      .catch(next);
  })
  .put('/:id/close', async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const authorId = await issueService.getAuthorId(id);
    const repoOwnerId = await issueService.getRepoOwnerId(id);
    const isAccessGranted = checkIssuePermissions(id, userId);
    if (userId !== authorId && userId !== repoOwnerId && !isAccessGranted) {
      res.status(401).send('Only issue author or repo owner can close it');
      return;
    }

    issueService
      .closeIssueById(id)
      .then(([, data]) => res.send(data))
      .catch(next);
  })
  .put('/:id/reopen', async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const authorId = await issueService.getAuthorId(id);
    const repoOwnerId = await issueService.getRepoOwnerId(id);
    const isAccessGranted = checkIssuePermissions(id, userId);

    if (userId !== authorId && userId !== repoOwnerId && !isAccessGranted) {
      res.status(401).send('Only issue author or repo owner can reopen it');
      return;
    }

    issueService
      .reopenIssueById(id)
      .then(([, data]) => res.send(data))
      .catch(next);
  })
  .delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const authorId = await issueService.getAuthorId(id);
    const isAccessGranted = checkIssuePermissions(id, userId);
    if (userId !== authorId && !isAccessGranted) {
      res.status(401).send('Only issue author can update it');
      return;
    }

    issueService
      .deleteIssueById(id)
      .then((result) => {
        if (result) {
          res.status(204).send({});
        } else {
          res.status(404).send('issue not found');
        }
      })
      .catch(next);
  })
  .get('/:issueId/comments', (req, res, next) => {
    const { issueId } = req.params;
    issueCommentService
      .getAllIssueComments({ issueId })
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:issueId/available-assignees', (req, res, next) => {
    const { issueId } = req.params;
    issueAssigneeService
      .getAvailableAssigneesByIssueId(issueId)
      .then(result => res.send(result))
      .catch(next);
  });

module.exports = router;
