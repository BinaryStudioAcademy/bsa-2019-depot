const { Router } = require('express');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const {
  createRepo, getSettings, renameRepo, changePrivacyRepo, deleteRepo
} = require('../services/repo.service');
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
  })
  .get('/:owner/:repoName/settings', jwtMiddleware, (req, res, next) => {
    const { owner, repoName } = req.params;
    console.log(req.user.id);
    getSettings({ ownerID: req.user.id, repoName })
      .then(settings => res.send(settings))
      .catch(next);
  })
  .post('/:owner/:repoName/settings/rename', jwtMiddleware, (req, res, next) => {
    const { repoName } = req.params;
    const { newName } = req.body;
    renameRepo({ ownerID: req.user.id, repoName, newName })
      .then(result => res.send(result))
      .catch(next);
  })
  .post('/:owner/:repoName/settings/privacy', jwtMiddleware, (req, res, next) => {
    const { repoName } = req.params;
    changePrivacyRepo({ ownerID: req.user.id, repoName })
      .then(result => res.send(result))
      .catch(next);
  })
  .delete('/:owner/:repoName/settings/delete', jwtMiddleware, (req, res, next) => {
    const { repoName } = req.params;
    deleteRepo({ ownerID: req.user.id, repoName, username: req.user.username })
      .then(result => res.send(result))
      .catch(next);
  });

module.exports = router;
