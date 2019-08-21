const { Router } = require('express');

const { clientUrl } = require('../../config/common.config');

const {
  createOrganization,
  addMember,
  acceptInvitation,
  cancelInvitation,
  getOrganizationMembers,
  getOrganizationOwner,
  getRelationUserOrg
} = require('../services/organization.service');
const { getUserById } = require('../services/user.service');

const router = Router();

router.get('/:orgID/users', (req, res) => {
  const { orgId } = req.params;
  getOrganizationMembers(orgId).then((data) => {
    const ids = data.map(record => record.dataValues.userId);
    const users = ids.map(user => getUserById(user));
    Promise.all(users).then((data) => {
      res.send(data);
    });
  });
});

router.get('/:orgID/owner', (req, res) => {
  const { orgId } = req.params;
  getOrganizationOwner(orgId).then(data => res.send(data));
});

router.post('/new', (req, res) => {
  const { username, email, userID } = req.body;
  createOrganization({ username, email, userID }).then(data => res.send(data));
});

router.post('/invite', (req, res) => {
  const { orgName, username, role } = req.body;
  addMember({
    orgName,
    username,
    role,
    url: clientUrl
  }).then(data => res.send(data));
});

router.get('/:orgname/users/:userID', (req, res) => {
  const { orgname, userID } = req.params;
  getRelationUserOrg({ orgname, userID }).then(data => res.send(data));
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
