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
const { deleteStarsByRepoId, getStargazers } = require('../services/star.service');
const {
  getBranches, getBranchTree, getBranchInfo, getLastCommitOnBranch
} = require('../services/branch.service');
const { getAllRepoIssues, getRepoIssueByNumber } = require('../services/issue.service');
const { getLabelsByRepoId } = require('../services/label.service');
const { getFileContent } = require('../services/files.service');
const { getStatsByBranch } = require('../services/language-stats.service');
const ownerOnlyMiddleware = require('../middlewares/owner-only.middleware');
const issueService = require('../services/issue.service');

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
      const commitsCount = await getCommitCount(branchName, repoId);

      response = {
        ...branchInfo.get({ plain: true }),
        commitsCount
      };
    } catch (error) {
      next(error);
    }
    return res.send(response);
  })
  .get('/:repoId/branches', (req, res, next) => {
    const { repoId } = req.params;
    getBranches(repoId)
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
    getFileContent(owner, repoName, branchName, filepath)
      .then(fileData => res.send(fileData))
      .catch(next);
  })
  .get('/:owner/:repoName/:branchName/last-commit', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    getLastCommitOnBranch({ user: owner, name: repoName, branch: branchName })
      .then(commit => res.send(commit))
      .catch(next);
  })
  .get('/:repoId/branches/:branch/stats', (req, res, next) => {
    const { repoId, branch } = req.params;
    getStatsByBranch(repoId, branch)
      .then(stats => res.send(stats))
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
  // .get('/:owner/:repoName/issues/:number', (req, res, next) => {
  //   const { owner: username, repoName: name, number } = req.params;
  //   getRepoIssueByNumber({ username, name, number })
  //     .then(result => res.send(result))
  //     .catch(next);
  // })
  .put('/:owner/:reponame', ownerOnlyMiddleware, (req, res, next) => {
    const { owner, reponame } = req.params;
    updateByUserAndReponame({ owner, reponame, data: req.body })
      .then(data => res.send(data))
      .catch(next);
  })
  .put('/:owner/:reponame/change-type', ownerOnlyMiddleware, (req, res, next) => {
    const { owner, reponame } = req.params;
    const {
      body: { userId, repositoryId, isPublic }
    } = req;
    updateByUserAndReponame({ owner, reponame, data: req.body })
      .then(data => res.send(data))
      .catch(next);
    if (!isPublic) {
      deleteStarsByRepoId(userId, repositoryId);
    }
  })
  .get('/:repoId/stargazers', (req, res, next) => {
    const { repoId } = req.params;
    getStargazers(repoId)
      .then(stargazers => res.send(stargazers))
      .catch(next);
  })
  .put('/star', (req, res, next) => {
    const { userId, repositoryId } = req.body;
    setStar(userId, repositoryId)
      .then(star => res.send(star))
      .catch(next);
  })
  .get('/:repositoryId/labels', (req, res, next) => {
    const { repositoryId } = req.params;
    getLabelsByRepoId(repositoryId)
      .then(labels => res.send(labels))
      .catch(next);
  })
  .get('/:repositoryId/issues', (req, res, next) => {
    const { repositoryId } = req.params;
    const { sort, author, title } = req.query;
    issueService
      .getRepoIssues(repositoryId, sort, author, title)
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:reponame/issues/:number', (req, res, next) => {
    const { reponame, number } = req.params;
    getRepoIssueByNumber(reponame, number)
      .then(data => res.send(data))
      .catch(next);
  });

module.exports = router;
