const { Router } = require('express');
const { clientUrl } = require('../../config/common.config');
const { addCollaborator, getUserRights, getRepositoryCollaborators, removeRepositoryCollaborator } = require('../services/collaborator.service');

const router = Router();

router.get('/:repositoryId', (req, res, next) => {
  const { repositoryId } = req.params;
  getRepositoryCollaborators(repositoryId)
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
  const { recipient, username, reponame, repositoryId, permission } = req.body;
  addCollaborator({ recipient, username, reponame, repositoryId, permission, url: clientUrl })
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
