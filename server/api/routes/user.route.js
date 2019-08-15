const { Router } = require('express');

const { sendForgetPasswordEmail } = require('../services/email.service');
const {
  setUsername, checkUsernameExists, resetPassword, updateUserSettings
} = require('../services/user.service');
const { getKeysByUser, createKey, deleteKey } = require('../services/ssh-key.service');
const { getReqUrl } = require('../../helpers/req.helper');

const router = Router();

router.post('/username', (req, res, next) => {
  const { username } = req.body;
  const { id } = req.user;
  setUsername({ id, username })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/username-exists', (req, res, next) => {
  checkUsernameExists({ username: req.query.username })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/forget-password', (req, res, next) => {
  const { body } = req;
  sendForgetPasswordEmail({ ...body, url: getReqUrl(req) })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/reset-password', (req, res, next) => {
  resetPassword({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/settings', (req, res, next) => {
  updateUserSettings({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/keys', (req, res, next) => {
  getKeysByUser(req.user.id)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/keys', (req, res, next) => {
  const { id } = req.user;
  createKey({ userId: id, ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/keys/:id', (req, res, next) => {
  const { id } = req.params;
  deleteKey(id)
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;
