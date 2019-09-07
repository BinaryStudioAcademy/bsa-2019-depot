const { Router } = require('express');

const {
  modifyFile,
  deleteFile,
  getCommitCommentsByCommitId,
  createCommit,
  deleteCommitById
} = require('../services/commit.service');

const router = Router();

router
  .post('/:username/:reponame/:branchName', (req, res, next) => {
    const { username, reponame, branchName: branch } = req.params;
    const { toDelete, ...commitArgs } = req.body;
    if (toDelete) {
      deleteFile({
        ...commitArgs,
        owner: username,
        reponame,
        branch
      })
        .then(newCommit => res.send({ sha: newCommit.sha() }))
        .catch(next);
    } else {
      modifyFile({
        ...commitArgs,
        owner: username,
        reponame,
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
