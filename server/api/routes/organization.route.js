const { Router } = require('express');

const { createOrganization } = require('../services/organization.service');

const router = Router();

router.post('/new', (req, res) => {
  const { username, email, userID } = req.body;
  createOrganization({ username, email, userID }).then(data => res.send(data));
});

module.exports = router;
