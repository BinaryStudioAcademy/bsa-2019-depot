const { Router } = require('express');

const { sendForgetPasswordEmail } = require('../services/email.service');
const {
  setUsername,
  checkUsernameExists,
  resetPassword,
  updateUserSettings,
  getUserDetailed,
  getStars,
  getUsersToInviting,
  getUsersOrganizations,
  getUsersForCollaboratorsAddition,
  uploadPhoto,
  deletePhoto,
  setStatus,
  getStatus
} = require('../services/user.service');
const { getReposData, getByUserAndReponame } = require('../services/repo.service');
const { getCommitsAndCreatedRepoByDate } = require('../services/commit.service');
const { getKeysByUser } = require('../services/ssh-key.service');
const { getRepoIssueByNumber } = require('../services/issue.service');
const {
  getRepoPullByNumber, getAllPullsOwners, getUserPulls, getPullCount
} = require('../services/pulls.service');
const { getAllIssues, getAllIssuesCount, getAllIssuesOwners } = require('../services/issue.service');
const { getUserByUsername } = require('../services/user.service');
const { clientUrl } = require('../../config/common.config');
const PinnedReposService = require('../services/pinned-repos.service');

const router = Router();

router.get('/username-exists', (req, res, next) => {
  checkUsernameExists({ username: req.query.username })
    .then(data => res.send(data))
    .catch(next);
});

router.put('/forgot-password', (req, res, next) => {
  const { body } = req;
  sendForgetPasswordEmail({ ...body, url: clientUrl })
    .then(data => res.send(data))
    .catch(next);
});

router.put('/reset-password', (req, res, next) => {
  resetPassword({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.put('/', (req, res, next) => {
  updateUserSettings({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:userId/keys', (req, res, next) => {
  const { userId } = req.params;
  getKeysByUser(userId)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:username/overview', (req, res, next) => {
  const { username } = req.params;
  const isOwner = req.user.username === username;
  getUserDetailed(username, isOwner)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/username', (req, res, next) => {
  const { username } = req.body;
  const { id } = req.user;
  setUsername({ id, username })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:username/stars', (req, res, next) => {
  const { username } = req.params;
  getStars(username)
    .then(stars => res.send(stars))
    .catch(next);
});

router.get('/search/:username/:orgID', (req, res) => {
  const { orgID, username } = req.params;
  getUsersToInviting({ orgID, username }).then(data => res.send(data));
});

router.get('/:userid/organizations', (req, res, next) => {
  const { userid } = req.params;
  getUsersOrganizations(userid)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:username/contribution-activity', (req, res, next) => {
  const { username } = req.params;
  const isOwner = req.user.username === username;
  getCommitsAndCreatedRepoByDate({ user: username, isOwner })
    .then(commits => res.send(commits))
    .catch(next);
});

router.get('/:username/repos', (req, res, next) => {
  const { username } = req.params;
  const isOwner = req.user.get({ plain: true }).username === username;
  getReposData({ username, isOwner, userId: req.user.id })
    .then(repos => res.send(repos))
    .catch(next);
});

router.get('/:username/public-repos', (req, res, next) => {
  const { username } = req.params;
  getReposData({ username, isOwner: false, userId: req.user.id })
    .then(repos => res.send(repos))
    .catch(next);
});

router.get('/:username/repos/:repo', async (req, res, next) => {
  try {
    const { username, repo } = req.params;
    const repoData = await getByUserAndReponame({ owner: username, reponame: repo });
    res.send(repoData);
  } catch (error) {
    next(error);
  }
});

router.get('/search/collaborators/:username/:repositoryId/:userId', (req, res, next) => {
  const { username, repositoryId, userId } = req.params;
  getUsersForCollaboratorsAddition({ username, repositoryId, userId })
    .then(data => res.send(data))
    .catch(next);
});

router.post('/image', (req, res, next) => {
  uploadPhoto({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.delete('/image', (req, res, next) => {
  deletePhoto({ ...req.body })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/:username/issues', (req, res, next) => {
  const { username } = req.params;
  const { isOpened, sort, owner } = req.query;

  getUserByUsername(username)
    .then((data) => {
      const { id } = data;
      Promise.all([
        getAllIssuesCount(id, { owner, isOpened: true }),
        getAllIssuesCount(id, { owner, isOpened: false }),
        getAllIssuesOwners(id),
        getAllIssues(id, { isOpened, sort, owner })
      ])
        .then((result) => {
          res.send({
            open: result[0],
            close: result[1],
            owners: result[2],
            issues: result[3]
          });
        })
        .catch(next);
    })
    .catch(next);
});

router.get('/:username/pulls', async (req, res, next) => {
  try {
    const { username } = req.params;
    const {
      isOpened, sort, owner, reviewRequests
    } = req.query;

    const { id: userId } = await getUserByUsername(username);
    const open = await getPullCount({
      userId,
      isOpened: true,
      sort,
      owner,
      reviewRequests
    });
    const close = await getPullCount({
      userId,
      isOpened: false,
      sort,
      owner,
      reviewRequests
    });
    const owners = await getAllPullsOwners(userId);
    const pulls = await getUserPulls({
      userId,
      isOpened,
      sort,
      owner,
      reviewRequests
    });

    res.send({
      open,
      close,
      owners,
      pulls
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:username/repos/:reponame/issues/:number', (req, res, next) => {
  const { username, reponame, number } = req.params;
  getRepoIssueByNumber(username, reponame, number)
    .then(result => res.send(result))
    .catch(next);
});

router.get('/:username/repos/:reponame/pulls/:number', (req, res, next) => {
  const { username, reponame, number } = req.params;
  getRepoPullByNumber(username, reponame, number)
    .then(result => res.send(result))
    .catch(next);
});

router.get('/:userId/pinned-repositories', (req, res, next) => {
  const { userId } = req.params;
  const isOwner = req.user.get({ plain: true }).id === userId;
  PinnedReposService.getPinnedRepos(userId, isOwner)
    .then(result => res.send(result))
    .catch(next);
});

router.post('/set-pinned-repos', (req, res, next) => {
  const { userId, repositories } = req.body;
  PinnedReposService.setPinnedRepos(userId, repositories)
    .then(result => res.send(result))
    .catch(next);
});

router.post('/set-status', (req, res, next) => {
  const { status } = req.body;
  const { id: userId } = req.user;
  setStatus(userId, status)
    .then(result => res.send(result))
    .catch(next);
});

router.get('/:username/status', (req, res, next) => {
  const { username } = req.params;
  getStatus(username)
    .then(result => res.send(result))
    .catch(next);
});

module.exports = router;
