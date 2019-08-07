const { Router } = require('express');

const jwtMiddleware = require('../middlewares/jwt.middleware');
const { setUsername, checkUsernameExists, checkEmailExists } = require('../services/user.service');

const router = Router();

router.post('/username', jwtMiddleware, (req, res, next) => {
  const { username } = req.body;
  const { id } = req.user;
  setUsername({ id, username })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/username-exists', (req, res, next) => {
  checkUsernameExists({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/email-exists', (req, res, next) => {
  checkEmailExists({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
