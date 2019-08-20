const { Router } = require('express');

const {
  getCommits,
  getCommitsByDate,
  modifyFile,
  deleteFile,
  getCommitCommentsByCommitId,
  createCommit
} = require('../services/commit.service');
const ownerOnlyMiddleware = require('../middlewares/owner-only.middleware');

const router = Router();

router
  .get('/', (req, res) => {
    getCommits({ ...req.body }).then(data => res.send(data));
  })
  /* todo: refactor to match updated API */
  .get('/:owner/commits', (req, res, next) => {
    const { owner } = req.params;
    getCommitsByDate({ user: owner })
      .then(commits => res.send(commits))
      .catch(next);
  })
  .post('/:owner/:repoName/:branchName', ownerOnlyMiddleware, (req, res, next) => {
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
  })
  .get('/:commitId/comments', (req, res, next) => {
    const { commitId } = req.params;
    getCommitCommentsByCommitId(commitId)
      .then(comments => res.status(200).send(comments))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    const { sha, repoId } = req.body;
    createCommit({ sha, repoId })
      .then(commit => res.status(201).send(commit))
      .catch(next);
  });

module.exports = router;
