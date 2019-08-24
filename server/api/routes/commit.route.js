const { Router } = require('express');

const {
  getCommits,
  getCommitsByDate,
  modifyFile,
  deleteFile,
  getCommitCommentsByCommitId,
  createCommit,
  deleteCommitById
} = require('../services/commit.service');
const ownerOnlyMiddleware = require('../middlewares/owner-only.middleware');

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
      .then(comments => res.send(comments))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    const { sha, repositoryId } = req.body;
    createCommit({ sha, repositoryId })
      .then(commit => res.send(commit))
      .catch(next);
  })
  .delete('/', (req, res, next) => {
    const { id, userId } = req.body;
    deleteCommitById(id, userId)
      .then(result => res.send(result))
      .catch(next);
  });

module.exports = router;
