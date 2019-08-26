const { Router } = require('express');
const {
  addIssue,
  updateIssueById,
  getIssueById,
  deleteIssueById,
  closeIssueById,
  reopenIssueById,
  getAuthorId,
  getRepoOwnerId
} = require('../services/issue.service');

const router = Router();

router
  .post('/', (req, res, next) => {
    const {
      userId, repositoryId, title, body
    } = req.body;
    addIssue({
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
    const authorId = await getAuthorId(id);

    if (userId !== authorId) {
      res.status(401).send('Only issue author can update it');
      return;
    }

    updateIssueById({
      id,
      title,
      body
    })
      .then(([, data]) => res.send(data))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const { id } = req.params;

    getIssueById(id)
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:id/close', async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const authorId = getAuthorId(id);
    const repoOwnerId = await getRepoOwnerId(id);

    if (userId !== authorId && userId !== repoOwnerId) {
      res.status(401).send('Only issue author or repo owner can close it');
      return;
    }

    closeIssueById(id)
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:id/reopen', async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const authorId = getAuthorId(id);
    const repoOwnerId = await getRepoOwnerId(id);

    if (userId !== authorId && userId !== repoOwnerId) {
      res.status(401).send('Only issue author or repo owner can reopen it');
      return;
    }

    reopenIssueById(id)
      .then(result => res.send(result))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const { id } = req.params;

    const userId = req.user.id;
    const authorId = getAuthorId(id);

    if (userId !== authorId) {
      res.status(401).send('Only issue author can update it');
      return;
    }

    deleteIssueById(id)
      .then((result) => {
        if (result) {
          res.status(204).send({});
        } else {
          res.status(404).send('issue not found');
        }
      })
      .catch(next);
  });

module.exports = router;
