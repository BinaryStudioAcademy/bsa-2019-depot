const { Router } = require('express');

const { clientUrl } = require('../../config/common.config');

const { addCollaborator } = require('../services/collaborator.service');

const router = Router();

router.post('/invite', (req, res, next) => {
  const { userId, repositoryId, permission } = req.body;
  addCollaborator({
    userId,
    repositoryId,
    permission,
    url: clientUrl
  })
  .then(data => res.send(data))
  .catch(next);
});

module.exports = router;
