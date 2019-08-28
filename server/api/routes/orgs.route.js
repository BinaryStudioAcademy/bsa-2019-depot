const { Router } = require('express');

const { clientUrl } = require('../../config/common.config');

const {
  createOrganization,
  addMember,
  getRelationUserOrg,
  acceptInvitation,
  cancelInvitation,
  getOrganizationMembers,
  getOrganizationOwner
} = require('../services/organization.service');

const router = Router();

router.get('/:orgID/users', (req, res, next) => {
  const { orgID } = req.params;
  getOrganizationMembers(orgID)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:orgID/owner', (req, res, next) => {
  const { orgID } = req.params;
  getOrganizationOwner(orgID)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { username, email, userID } = req.body;
  createOrganization({ username, email, userID })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/invite', (req, res, next) => {
  const { orgName, username, role } = req.body;
  addMember({
    orgName,
    username,
    role,
    url: clientUrl
  })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:orgname/users/:userID', (req, res, next) => {
  const { orgname, userID } = req.params;
  getRelationUserOrg({ orgname, userID })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/invitation', (req, res, next) => {
  const { orgName, userId } = req.body;
  acceptInvitation({ orgName, userId })
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/invitation', (req, res, next) => {
  const { orgName, userId } = req.body;
  cancelInvitation({ orgName, userId })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
