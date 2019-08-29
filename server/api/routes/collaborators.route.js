const { Router } = require('express');
const { clientUrl } = require('../../config/common.config');
const { addCollaborator, getUserRights } = require('../services/collaborator.service');

const router = Router();

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
