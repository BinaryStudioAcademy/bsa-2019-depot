const { Router } = require('express');

const {
  getCommits, getCommitsByDate, modifyFile, deleteFile
} = require('../services/commit.service');

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
  })
  .post('/:owner/:repoName/:branchName', (req, res, next) => {
    const { owner, repoName, branchName: branch } = req.params;
    const { toDelete, ...commitArgs } = req.body;
    if (toDelete) {
      deleteFile({
        ...commitArgs,
        owner,
        repoName,
        branch
      })
        .then(newCommit => res.send({ sha: newCommit.sha() }))
        .catch(next);
    } else {
      modifyFile({
        ...commitArgs,
        owner,
        repoName,
        baseBranch: branch
      })
        .then(newCommit => res.send({ sha: newCommit.sha() }))
        .catch(next);
    }
  });

module.exports = router;
