const { Router } = require('express');
const { clientUrl } = require('../../config/common.config');
const {
  getRepositoryCollaborators, getUserInvitationStatus, acceptInvitation, declineInvitation, removeRepositoryCollaborator, addCollaborator, getUserRights
} = require('../services/collaborator.service');

const router = Router();

router.get('/:repositoryId', (req, res, next) => {
  const { repositoryId } = req.params;
  getRepositoryCollaborators(repositoryId)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:username/:reponame/:userId', (req, res, next) => {
  const { username, reponame, userId } = req.params;
  getUserInvitationStatus(username, reponame, userId)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { username, reponame, userId } = req.body;
  acceptInvitation(username, reponame, userId)
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.delete('/', (req, res, next) => {
  const { username, reponame, userId } = req.body;
  declineInvitation(username, reponame, userId)
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.delete('/:collaboratorId', (req, res, next) => {
  const { collaboratorId } = req.params;
  removeRepositoryCollaborator(collaboratorId)
    .then(() => res.sendStatus(200))
    .catch(next);
});

router.post('/invite', (req, res, next) => {
  const {
    recipient, username, reponame, repositoryId, permission
  } = req.body;
  addCollaborator({
    recipient, username, reponame, repositoryId, permission, url: clientUrl
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
