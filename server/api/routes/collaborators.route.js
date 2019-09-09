const { Router } = require('express');
const { clientUrl } = require('../../config/common.config');
const {
  getUserInvitationStatus,
  acceptInvitation,
  declineInvitation,
  removeRepositoryCollaborator,
  addCollaborator,
  getUserRights
} = require('../services/collaborator.service');

const router = Router();

router.get('/:userId/status', (req, res, next) => {
  const { userId } = req.params;
  const { username, reponame } = req.query;
  getUserInvitationStatus(username, reponame, userId)
    .then(data => res.send(data))
    .catch(next);
});

router.put('/accept', (req, res, next) => {
  const { username, reponame, userId } = req.body;
  acceptInvitation(username, reponame, userId)
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/decline', (req, res, next) => {
  const { username, reponame, userId } = req.body;
  declineInvitation(username, reponame, userId)
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/:collaboratorId', (req, res, next) => {
  const { collaboratorId } = req.params;
  removeRepositoryCollaborator(collaboratorId)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/invite', (req, res, next) => {
  const {
    recipient, username, reponame, repositoryId, permission
  } = req.body;
  addCollaborator({
    recipient,
    username,
    reponame,
    repositoryId,
    permission,
    url: clientUrl
  })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/permissions/:username/:reponame/:userId', (req, res, next) => {
  const { username, reponame, userId } = req.params;
  getUserRights(username, reponame, userId)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
