const { Router } = require('express');

const {
  createRepo,
  renameRepo,
  deleteRepo,
  checkName,
  getRepoData,
  isEmpty,
  forkRepo,
  setStar,
  updateByUserAndReponame,
  getRepositoryForks,
  getAvailableAssigneesByRepoId
} = require('../services/repo.service');
const {
  getCommits,
  getCommitDiff,
  getCommitCount,
  getCommitActivityData,
  getUsersCommitsByRepositoryId
} = require('../services/commit.service');
const { deleteStarsByRepoId, getRepositoryStargazers } = require('../services/star.service');
const {
  getBranches,
  getBranchTree,
  getFileBlame,
  getBranchInfo,
  getLastCommitOnBranch,
  checkFileExists
} = require('../services/branch.service');
const { getAllRepoIssues, getRepoIssueByNumber } = require('../services/issue.service');
const { getLabelsByRepoId } = require('../services/label.service');
const { getFileContent } = require('../services/files.service');
const { getStatsByBranch } = require('../services/language-stats.service');
const { getRepositoryCollaborators } = require('../services/repo.service');
const ownerOnlyMiddleware = require('../middlewares/owner-only.middleware');
const isReaderMiddleware = require('../middlewares/is-reader.middleware');
const isAdminMiddleware = require('../middlewares/is-admin.middleware');

const issueService = require('../services/issue.service');
const pullsService = require('../services/pulls.service');
const userService = require('../services/user.service');

const router = Router();

router
  .post('/', (req, res) => {
    const { reponame, ownerID } = req.body;
    createRepo({ userId: ownerID, name: reponame, ...req.body }).then(data => res.send(data));
  })
  .get('/:username/:reponame/check-name', (req, res, next) => {
    const { username, reponame } = req.params;
    checkName({ owner: username, reponame })
      .then(result => res.send({ exists: result }))
      .catch(next);
  })
  .get('/:username/:reponame/is-empty', isReaderMiddleware, (req, res, next) => {
    const { username, reponame } = req.params;
    isEmpty({ owner: username, reponame })
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  })
  .get('/:repositoryId/branches/:branch/commits', isReaderMiddleware, (req, res, next) => {
    const { repositoryId, branch } = req.params;
    getCommits(branch, repositoryId)
      .then(commits => res.send(commits))
      .catch(next);
  })
  .get('/:repositoryId/branches/:branch', isReaderMiddleware, async (req, res, next) => {
    let response;
    try {
      const { repositoryId, branch: branchName } = req.params;
      const branchInfo = await getBranchInfo(branchName, repositoryId);
      const commitsCount = await getCommitCount(branchName, repositoryId);

      response = {
        ...branchInfo.get({ plain: true }),
        commitsCount
      };
    } catch (error) {
      next(error);
    }
    return res.send(response);
  })
  .get('/:repositoryId/branches', isReaderMiddleware, (req, res, next) => {
    const { repositoryId } = req.params;
    getBranches(repositoryId)
      .then(branches => res.send(branches))
      .catch(next);
  })
  .get('/:username/:reponame/:hash/commit', isReaderMiddleware, (req, res, next) => {
    const { username, reponame, hash } = req.params;
    getCommitDiff({ user: username, name: reponame, hash })
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:username/:reponame/:branchName/tree', isReaderMiddleware, (req, res, next) => {
    const { username, reponame, branchName } = req.params;
    const { pathToDir } = req.query;
    getBranchTree({
      user: username,
      name: reponame,
      branch: branchName,
      pathToDir
    })
      .then(tree => res.send(tree))
      .catch(next);
  })
  .get('/:username/:reponame/:branchName/file', isReaderMiddleware, (req, res, next) => {
    const { username, reponame, branchName } = req.params;
    const { filepath } = req.query;
    getFileContent(username, reponame, branchName, filepath)
      .then(fileData => res.send(fileData))
      .catch(next);
  })
  .get('/:owner/:repoName/:branchName/blame', (req, res, next) => {
    const { owner, repoName, branchName } = req.params;
    const { filepath } = req.query;
    getFileBlame({
      user: owner,
      name: repoName,
      branch: branchName,
      filepath
    })
      .then(fileData => res.send(fileData))
      .catch(next);
  })
  .get('/:username/:reponame/:branchName/last-commit', isReaderMiddleware, (req, res, next) => {
    const { username, reponame, branchName } = req.params;
    getLastCommitOnBranch({ user: username, name: reponame, branch: branchName })
      .then(commit => res.send(commit))
      .catch(next);
  })
  .get('/:repositoryId/branches/:branch/stats', isReaderMiddleware, (req, res, next) => {
    const { repositoryId, branch } = req.params;
    getStatsByBranch(repositoryId, branch)
      .then(stats => res.send(stats))
      .catch(next);
  })
  .get('/:username/:reponame/:branch/file-exist', (req, res, next) => {
    const { username, reponame, branch } = req.params;
    const { filepath } = req.query;
    checkFileExists(username, reponame, branch, filepath)
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:username/:reponame/settings', isAdminMiddleware, (req, res) => {
    res.sendStatus(200);
  })
  .post('/:username/:reponame/settings/rename', isAdminMiddleware, (req, res, next) => {
    const { reponame, username: orgName } = req.params;
    const { newName } = req.body;
    renameRepo({
      reponame,
      newName,
      username: req.user.username,
      orgName
    })
      .then(result => res.send(result))
      .catch(next);
  })
  .delete('/:username/:reponame/settings', ownerOnlyMiddleware, (req, res, next) => {
    const { reponame, username: orgName } = req.params;
    deleteRepo({ reponame, username: req.user.username, orgName })
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
  .get('/:username/:reponame/issues', isReaderMiddleware, (req, res, next) => {
    const { repositoryId } = req.query;
    getAllRepoIssues({ repositoryId })
      .then(result => res.send(result))
      .catch(next);
  })
  .put('/:username/:reponame', isAdminMiddleware, (req, res, next) => {
    const { username, reponame } = req.params;
    updateByUserAndReponame({ owner: username, reponame, data: req.body })
      .then(data => res.send(data))
      .catch(next);
  })
  .put('/:username/:reponame/change-type', isAdminMiddleware, (req, res, next) => {
    const { username, reponame } = req.params;
    const {
      body: { userId, repositoryId, isPublic }
    } = req;
    updateByUserAndReponame({ owner: username, reponame, data: req.body })
      .then(data => res.send(data))
      .catch(next);
    if (!isPublic) {
      deleteStarsByRepoId(userId, repositoryId);
      req.reposNsp.to(repositoryId).emit('changedToPrivate', repositoryId);
    }
  })
  .put('/star', (req, res, next) => {
    const { userId, repositoryId } = req.body;
    setStar(userId, repositoryId)
      .then(star => res.send(star))
      .catch(next);
  })
  .get('/:repositoryId/labels', isReaderMiddleware, (req, res, next) => {
    const { repositoryId } = req.params;
    getLabelsByRepoId(repositoryId)
      .then(labels => res.send(labels))
      .catch(next);
  })
  .get('/:repositoryId/issues', isReaderMiddleware, async (req, res, next) => {
    const { repositoryId } = req.params;
    const {
      sort, authorId, assigneeId, title, isOpened
    } = req.query;
    try {
      const issues = await issueService.getRepoIssues(repositoryId, sort, authorId, assigneeId, title, isOpened);
      const authors = await userService.getIssuesAuthors(repositoryId);
      const assignees = await userService.getIssuesAssignees(repositoryId);
      const openCount = await issueService.getIssueCount(repositoryId, true);
      const closedCount = await issueService.getIssueCount(repositoryId, false);
      res.send({
        openCount,
        closedCount,
        authors,
        assignees,
        issues
      });
    } catch (e) {
      next(e);
    }
  })
  .get('/:reponame/issues/:number', isReaderMiddleware, (req, res, next) => {
    const { reponame, number } = req.params;
    getRepoIssueByNumber(reponame, number)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId/pulls/diffs', (req, res, next) => {
    const { repositoryId } = req.params;
    const { fromCommitId, toCommitId } = req.query;
    pullsService
      .getPullData(repositoryId, fromCommitId, toCommitId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:username/:reponame/pulls', isReaderMiddleware, (req, res, next) => {
    const { repositoryId } = req.query;
    pullsService
      .getPulls(repositoryId)
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/:repositoryId/pulls', isReaderMiddleware, async (req, res, next) => {
    const { repositoryId } = req.params;
    const {
      sort, authorId, title, isOpened
    } = req.query;
    try {
      const pulls = await pullsService.getRepoPulls(repositoryId, sort, authorId, title, isOpened);
      const authors = await userService.getPullsAuthors(repositoryId);
      const openCount = await pullsService.getPullCount({ repositoryId, isOpened: true });
      const closedCount = await pullsService.getPullCount({ repositoryId, isOpened: false });
      res.send({
        openCount,
        closedCount,
        authors,
        pulls
      });
    } catch (e) {
      next(e);
    }
  })
  .post('/:repositoryId/pulls/labels', async (req, res, next) => {
    const { labelIds, pullId } = req.body;
    pullsService
      .setLabels(labelIds, pullId)
      .then(() => res.send({}))
      .catch(next);
  })

  .get('/:repositoryId/collaborators', (req, res, next) => {
    const { repositoryId } = req.params;
    getRepositoryCollaborators(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId/forks', (req, res, next) => {
    const { repositoryId } = req.params;
    getRepositoryForks(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId/stargazers', (req, res, next) => {
    const { repositoryId } = req.params;
    getRepositoryStargazers(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId/commit-activity-data', (req, res, next) => {
    const { repositoryId } = req.params;
    getCommitActivityData(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId', (req, res, next) => {
    const { repositoryId } = req.params;
    getRepoData(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId/available-assignees', (req, res, next) => {
    const { repositoryId } = req.params;
    getAvailableAssigneesByRepoId(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  })
  .get('/:repositoryId/commit-activity-data-by-user', (req, res, next) => {
    const { repositoryId } = req.params;
    getUsersCommitsByRepositoryId(repositoryId)
      .then(data => res.send(data))
      .catch(next);
  });

module.exports = router;
