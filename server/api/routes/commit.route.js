const { Router } = require('express');

const { getCommits } = require('../services/commit.service');

const router = Router();

router.get('/', (req, res, next) => {
  getCommits({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
