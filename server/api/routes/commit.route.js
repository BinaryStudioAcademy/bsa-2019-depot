const { Router } = require('express');

const { getCommits, getCommitsByDate } = require('../services/commit.service');

const router = Router();

router
  .get('/', (req, res) => {
    getCommits({ ...req.body }).then(data => res.send(data));
  })
  .get('/:owner/commits', (req, res, next) => {
    const { owner } = req.params;
    getCommitsByDate({ user: owner })
      .then(commits => res.send(commits))
      .catch(next);
  });

module.exports = router;
