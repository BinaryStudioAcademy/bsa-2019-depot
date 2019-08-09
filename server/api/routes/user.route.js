const { Router } = require('express');

const jwtMiddleware = require('../middlewares/jwt.middleware');
const { setUsername, checkUsernameExists } = require('../services/user.service');

const router = Router();

router.post('/username', jwtMiddleware, (req, res, next) => {
  const { username, profile } = req.body;
  const { id } = profile;

  setUsername({ id, username })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/username-exists', (req, res, next) => {
  checkUsernameExists({ username: req.query.username })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
