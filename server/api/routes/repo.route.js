const { Router } = require('express');

const { createRepo } = require('../services/repo.service');
const { getCommits } = require('../services/commit.service');
const { getBranches } = require('../services/branch.service');

const router = Router();

router
  .post('/', (req, res) => {
    createRepo({ ...req.body }).then(data => res.send(data));
  })
  .get('/:owner/:repoName/:branchName/commits', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    getCommits({ user: owner, name: repoName, branch: branchName })
      .then(commits => res.send(commits))
      .catch(next);
  })
  .get('/:owner/:repoName/branches', (req, res, next) => {
    const { owner, repoName } = req.params;
    getBranches({ user: owner, repoName })
      .then(branches => res.send(branches))
      .catch(next);
  });

module.exports = router;
