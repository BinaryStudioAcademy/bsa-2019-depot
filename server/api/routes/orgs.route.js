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
const ownerOnlyMiddleware = require('../middlewares/owner-only.middleware');
const isReaderMiddleware = require('../middlewares/is-reader.middleware');
const isAdminMiddleware = require('../middlewares/is-admin.middleware');

const router = Router();

router.get('/:orgID/users', isReaderMiddleware, (req, res, next) => {
  const { orgID } = req.params;
  getOrganizationMembers(orgID)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:orgID/owner', isReaderMiddleware, (req, res, next) => {
  const { orgID } = req.params;
  getOrganizationOwner(orgID)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/', isReaderMiddleware, (req, res, next) => {
  const { username, email, userID } = req.body;
  createOrganization({ username, email, userID })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/invite', isAdminMiddleware, (req, res, next) => {
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

router.get('/:orgname/users/:userID', isReaderMiddleware, (req, res, next) => {
  const { orgname, userID } = req.params;
  getRelationUserOrg({ orgname, userID })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/invitation', isAdminMiddleware, (req, res, next) => {
  const { orgName, userId } = req.body;
  acceptInvitation({ orgName, userId })
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/invitation', ownerOnlyMiddleware, (req, res, next) => {
  const { orgName, userId } = req.body;
  cancelInvitation({ orgName, userId })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
