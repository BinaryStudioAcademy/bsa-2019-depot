const { Router } = require('express');

const { getCommits } = require('../services/commit.service');

const router = Router();

router.get('/', (req, res) => {
  getCommits({ ...req.body }).then(data => res.send(data));
});

module.exports = router;
