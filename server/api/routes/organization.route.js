const { Router } = require('express');

const { createOrganization } = require('../services/organization.service');

const router = Router();

router.post('/new', (req, res) => {
  const { username, email } = req.body;
  createOrganization({ username, email }).then(data => res.send(data));
});

module.exports = router;
