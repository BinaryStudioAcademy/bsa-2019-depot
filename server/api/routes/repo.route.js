const { Router } = require('express');

const {
  createRepo,
  renameRepo,
  deleteRepo,
  getReposNames,
  checkName,
  isEmpty,
  getCurrentRepoId,
  forkRepo
} = require('../services/repo.service');
const { getCommits, getCommitDiff } = require('../services/commit.service');
const {
  getBranches, getBranchTree, getLastCommitOnBranch, getFileContent
} = require('../services/branch.service');
const { addIssue, addIssueComment, getAllRepoIssues, getAllIssueComments } = require('../services/issue.service');

const router = Router();

router
  .post('/', (req, res) => {
    const { reponame, ownerID } = req.body;
    createRepo({ userId: ownerID, name: reponame, ...req.body }).then(data => res.send(data));
  })
  .get('/:owner/:reponame/check-name', (req, res, next) => {
    const { owner, reponame } = req.params;
    checkName({ owner, reponame })
      .then(result => res.send({ exists: result }))
      .catch(next);
  })
  .get('/:owner/:reponame/is-empty', (req, res, next) => {
    const { owner, reponame } = req.params;
    isEmpty({ owner, reponame })
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  })
  .get('/:owner/repos', (req, res, next) => {
    const { filterWord, limit } = req.body;
    const { owner } = req.params;
    getReposNames({ user: owner, filter: filterWord, limit })
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
  .get('/:owner/:repoName/:hash/commit', (req, res, next) => {
    const { owner, repoName, hash } = req.params;
    getCommitDiff({ user: owner, name: repoName, hash })
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:owner/:repoName/:branchName/tree', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    const { pathToDir } = req.query;
    getBranchTree({
      user: owner,
      name: repoName,
      branch: branchName,
      pathToDir
    })
      .then(tree => res.send(tree))
      .catch(next);
  })
  .get('/:owner/:repoName/:branchName/file', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    const { filepath } = req.query;
    getFileContent({
      user: owner,
      name: repoName,
      branch: branchName,
      filepath
    })
      .then(fileData => res.send(fileData))
      .catch(next);
  })
  .get('/:owner/:repoName/:branchName/last-commit', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    getLastCommitOnBranch({ user: owner, name: repoName, branch: branchName })
      .then(commit => res.send(commit))
      .catch(next);
  })
  .get('/:owner/:repoName/settings', (req, res) => {
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
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:owner/:repoName/id', (req, res, next) => {
    const { userId } = req.query;
    getCurrentRepoId({ userId, name: req.params.repoName })
      .then(result => res.send(result))
      .catch(next);
  })
  .post('/:owner/:repoName/issues', (req, res, next) => {
    const { userId, repositoryId, title, body, isOpened, assignees } = req.body;
    addIssue({ userId, repositoryId, title, body, isOpened, assignees })
      .then(() => res.send({
        status: true
      }))
      .catch(next);
  })
  .get('/:owner/:repoName/issues', (req, res, next) => {
    const { repositoryId } = req.query;
    getAllRepoIssues({ repositoryId })
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:owner/:repoName/issues/:issueId/comments', (req, res, next) => {
    const { issueId } = req.params;
    getAllIssueComments({ issueId })
      .then(result => res.send(result))
      .catch(next);
  })
  .post('/:owner/:repoName/issues/:issueId/comments', (req, res, next) => {
    const { issueId } = req.params;
    const { userId, comment: body } = req.body;
    addIssueComment({ userId, issueId, body })
      .then(() => res.send({
        status: true
      }))
      .catch(next);
  });

module.exports = router;
