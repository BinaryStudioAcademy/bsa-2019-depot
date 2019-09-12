const { Router } = require('express');
const admin = require('firebase-admin');
const issueCommentService = require('../services/issue-comment.service');
const userService = require('../services/user.service');

const router = Router();

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  issueCommentService
    .getIssueCommentById(id)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const {
    issueId, userId, username, comment: body, title
  } = req.body;
  userService.getUserDetailed(username).then((data) => {
    const token = data.get({ plain: true }).deviceToken;
    const issueOwnerId = data.get({ plain: true }).id;
    if (token) {
      const message = {
        notification: {
          title: `New comment for issue ${title}`,
          body
        },
        token
      };
      if (userId !== issueOwnerId) {
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
    }
  });
  issueCommentService
    .addIssueComment({ userId, issueId, body })
    .then((data) => {
      const { issueId: id } = data;
      req.issuesNsp.to(id).emit('newIssueComment', data);
      return res.send(data);
    })
    .catch(next);
});

router.put('/', (req, res, next) => {
  const { id, comment: body } = req.body;
  const {
    user: { id: userId }
  } = req;
  issueCommentService
    .updateIssueCommentById(id, userId, { body })
    .then((data) => {
      const { issueId } = data;
      req.issuesNsp.to(issueId).emit('changedIssueComments');
      return res.send(data);
    })
    .catch(next);
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const comment = await issueCommentService.getIssueCommentById(id);
  const { issueId } = comment.get({ plain: true });
  issueCommentService
    .deleteIssueCommentById(id, userId)
    .then(() => {
      req.issuesNsp.to(issueId).emit('changedIssueComments');
      res.status(204).send({});
    })
    .catch(next);
});

module.exports = router;
