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
  getUsersOrganizations
} = require('../services/user.service');
const { getReposData, getByUserAndReponame } = require('../services/repo.service');
const { getCommitsAndCreatedRepoByDate } = require('../services/commit.service');
const { getKeysByUser } = require('../services/ssh-key.service');
const { clientUrl } = require('../../config/common.config');
const branchService = require('../services/branch.service');

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
  getUserDetailed(username)
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
  getCommitsAndCreatedRepoByDate({ user: username })
    .then(commits => res.send(commits))
    .catch(next);
});

router.get('/:username/repos', (req, res, next) => {
  const { username } = req.params;
  getReposData({ username })
    .then(repos => res.send(repos))
    .catch(next);
});

router.get('/:username/repos/:repo', async (req, res, next) => {
  try {
    const { username, repo } = req.params;
    const repoData = await getByUserAndReponame({ owner: username, reponame: repo });
    const branches = await branchService.getBranches({ user: username, repoName: repo });
    res.send({
      ...repoData.get({ plain: true }),
      branches
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
