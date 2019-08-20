const { Router } = require('express');

const { createCommitComment } = require('../services/commit-comment.service');

const router = Router();

router.post('/', (req, res) => {
  createCommitComment({ ...req.body }).then(data => res.send(data));
});

module.exports = router;
