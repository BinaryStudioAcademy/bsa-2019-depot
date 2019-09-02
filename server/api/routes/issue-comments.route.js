const { Router } = require('express');
const issueCommentService = require('../services/issue-comment.service');

const router = Router();

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  issueCommentService
    .getIssueCommentById(id)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { issueId, userId, comment: body } = req.body;
  issueCommentService
    .addIssueComment({ userId, issueId, body })
    .then(data => {
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
