const { Router } = require('express');
const {
  createRepo, renameRepo, deleteRepo, getReposNames, forkRepo
} = require('../services/repo.service');
const { getCommits } = require('../services/commit.service');
const { getBranches } = require('../services/branch.service');

const router = Router();

router
  .post('/', (req, res) => {
    createRepo({ ...req.body }).then(data => res.send(data));
  })
  .get('/:owner/repos', (req, res, next) => {
    const { owner } = req.params;
    getReposNames({ user: owner, filter: req.query })
      .then(repos => res.send(repos))
      .catch(next);
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
  .get('/:owner/:repoName/settings', (req, res, next) => {
    res.sendStatus(200);
    /* Can be used in future to get settings data from DB
    const { repoName } = req.params;
    getSettings({ ownerID: req.user.id, repoName })
      .then(settings => res.send(settings))
      .catch(next);
    */
  })
  .post('/:owner/:repoName/settings/rename', (req, res, next) => {
    const { repoName } = req.params;
    const { newName } = req.body;
    renameRepo({ repoName, newName, username: req.user.username })
      .then(result => res.send(result))
      .catch(next);
  })
  .delete('/:owner/:repoName/settings', (req, res, next) => {
    const { repoName } = req.params;
    deleteRepo({ repoName, username: req.user.username })
      .then(result => res.send(result))
      .catch(next);
  })
  .post('/:owner/:repoName', (req, res, next) => {
    const {
      params: { owner, repoName },
      user: {
        dataValues: { username }
      }
    } = req;

    forkRepo({ username, owner, repoName })
      .then(() => res.send({ status: true }))
      .catch(next);
  });

module.exports = router;
