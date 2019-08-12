const { Router } = require('express');

const {
  setUsername,
  checkUsernameExists,
  sendForgetPasswordEmail,
  resetPassword,
  updateUserSettings,
  getKeysByUser,
  createKey,
  deleteKey
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
  sendForgetPasswordEmail({ ...req.body })
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
  createKey({ id, ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/keys/:id', (req, res, next) => {
  const { id } = req.params.id;
  deleteKey(id)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
