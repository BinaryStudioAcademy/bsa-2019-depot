const { Router } = require('express');

const {
  createRepo,
  renameRepo,
  deleteRepo,
  checkName,
  isEmpty,
  forkRepo,
  setStar,
  updateByUserAndReponame
} = require('../services/repo.service');
const { getCommits, getCommitDiff, getCommitCount } = require('../services/commit.service');
const {
  getBranches, getBranchTree, getFileContent, getBranchInfo
} = require('../services/branch.service');
const { getAllRepoIssues, getRepoIssueByNumber } = require('../services/issue.service');
const ownerOnlyMiddleware = require('../middlewares/owner-only.middleware');

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
  .get('/:repoId/branches/:branch/commits', (req, res, next) => {
    const { repoId, branch } = req.params;
    getCommits(branch, repoId)
      .then(commits => res.send(commits))
      .catch(next);
  })
  .get('/:repoId/branches/:branch', async (req, res, next) => {
    let response;
    try {
      const { repoId, branch: branchName } = req.params;
      const branchInfo = await getBranchInfo(branchName, repoId);
      const {
        repository: { name: repoName },
        headCommit: {
          user: { username }
        },
        name
      } = branchInfo.get({ plain: true });
      const { pathToDir } = req.query;
      const branchFileTree = await getBranchTree({
        user: username,
        name: repoName,
        branch: name,
        pathToDir
      });
      response = {
        ...branchInfo.get({ plain: true }),
        fileTree: branchFileTree
      };
    } catch (error) {
      next(error);
    }
    return res.send(response);
  })
  .get('/:owner/:repoName/:branchName/count', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    getCommitCount({ user: owner, name: repoName, branch: branchName })
      .then(count => res.send(count))
      .catch(next);
  })
  .get('/:repoId/branches', (req, res, next) => {
    const { repoId } = req.params;
    getBranches(repoId)
      .then(branches => res.send(branches.map(branch => branch.name)))
      .catch(next);
  })
  .get('/:owner/:repoName/:hash/commit', (req, res, next) => {
    const { owner, repoName, hash } = req.params;
    getCommitDiff({ user: owner, name: repoName, hash })
      .then(data => res.send(data))
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
  .get('/:owner/:repoName/settings', ownerOnlyMiddleware, (req, res) => {
    res.sendStatus(200);
    /* Can be used in future to get settings data from DB
    const { repoName } = req.params;
    getSettings({ ownerID: req.user.id, repoName })
      .then(settings => res.send(settings))
      .catch(next);
    */
  })
  .post('/:owner/:repoName/settings/rename', ownerOnlyMiddleware, (req, res, next) => {
    const { repoName } = req.params;
    const { newName } = req.body;
    renameRepo({ repoName, newName, username: req.user.username })
      .then(result => res.send(result))
      .catch(next);
  })
  .delete('/:owner/:repoName/settings', ownerOnlyMiddleware, (req, res, next) => {
    const { repoName } = req.params;
    deleteRepo({ repoName, username: req.user.username })
      .then(result => res.send(result))
      .catch(next);
  })
  .post('/fork', (req, res, next) => {
    const {
      body: {
        owner,
        repoData: {
          id: forkedFromRepoId, name, website, description
        }
      },
      user: {
        dataValues: { id: userId, username }
      }
    } = req;

    forkRepo({
      userId,
      username,
      owner,
      name,
      website,
      description,
      forkedFromRepoId
    })
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:owner/:repoName/issues', (req, res, next) => {
    const { repositoryId } = req.query;
    getAllRepoIssues({ repositoryId })
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:owner/:repoName/issues/:number', (req, res, next) => {
    const { owner: username, repoName: name, number } = req.params;
    getRepoIssueByNumber({ username, name, number })
      .then(result => res.send(result))
      .catch(next);
  })
  .put('/:owner/:reponame', ownerOnlyMiddleware, (req, res, next) => {
    const { owner, reponame } = req.params;
    updateByUserAndReponame({ owner, reponame, data: req.body })
      .then(data => res.send(data))
      .catch(next);
  })
  .put('/star', (req, res, next) => {
    const { userId, repositoryId } = req.body;
    setStar(userId, repositoryId)
      .then(star => res.send(star))
      .catch(next);
  });

module.exports = router;
