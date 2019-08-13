const { Router } = require('express');

const { sendForgetPasswordEmail } = require('../services/email.service');
const {
  setUsername,
  checkUsernameExists,
  resetPassword,
  updateUserSettings
} = require('../services/user.service');

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
  const { protocol, hostname, headers } = req;
  const url = `${protocol}://${hostname}:${headers['x-forwarded-port']}`;
  sendForgetPasswordEmail({ ...req.body, url })
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

module.exports = router;
