const { Router } = require('express');

const { clientUrl } = require('../../config/common.config');

const {
  createOrganization, addMember, checkInvite, acceptInvitation, cancelInvitation
} = require('../services/organization.service');

const router = Router();

router.post('/new', (req, res) => {
  const { username, email, userID } = req.body;
  createOrganization({ username, email, userID }).then(data => res.send(data));
});

router.post('/invite', (req, res) => {
  const { orgName, username, role } = req.body;
  addMember({
    orgName, username, role, url: clientUrl
  }).then(data => res.send(data));
});

router.get('/invitation', (req, res) => {
  const { orgName, userId } = req.query;
  checkInvite({ orgName, userId }).then(data => res.send(data));
});

router.post('/invitation', (req, res) => {
  const { orgName, userId } = req.body;
  acceptInvitation({ orgName, userId }).then(data => res.send(data));
});

router.delete('/invitation', (req, res) => {
  const { orgName, userId } = req.body;
  cancelInvitation({ orgName, userId }).then(data => res.send(data));
});

module.exports = router;
