const { Router } = require('express');

const { setUsername, getUsername } = require('../services/user.service');

const router = Router();

router.post('/username', (req, res, next) => {
  setUsername({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/username', (req, res, next) => {
  getUsername({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
