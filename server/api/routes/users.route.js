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
  uploadPhoto,
  deletePhoto
} = require('../services/user.service');
const { getReposData, getByUserAndReponame } = require('../services/repo.service');
const { getCommitsAndCreatedRepoByDate } = require('../services/commit.service');
const { getKeysByUser } = require('../services/ssh-key.service');
const { getRepoIssueByNumber } = require('../services/issue.service');
const { getAllIssues, getAllIssuesCount, getAllIssuesOwners } = require('../services/issue.service');
const { getUserByUsername } = require('../services/user.service');
const { clientUrl } = require('../../config/common.config');

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
  const isOwner = req.user.get({ plain: true }).username === username;
  getReposData({ username, isOwner })
    .then(repos => res.send(repos))
    .catch(next);
});

router.get('/:username/repos/:repo', (req, res, next) => {
  const { username, repo } = req.params;
  getByUserAndReponame({ owner: username, reponame: repo })
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

    getUserByUsername(username).then(data => {
      const { id } = data;
      Promise.all([getAllIssuesCount(id, {owner, isOpened:true} ), getAllIssuesCount(id,  {owner, isOpened:false} ),  getAllIssuesOwners(id ), getAllIssues(id, {isOpened, sort, owner} )])
        .then(result => {
          res.send({"open" : result[0] , "close" :  result[1], "owners": result[2], "issues" : result[3]} )
        })
        .catch(next);
    }).catch(next);

  });

router.get('/:username/repos/:reponame/issues/:number', (req, res, next) => {
  const { username, reponame, number } = req.params;
  getRepoIssueByNumber(username, reponame, number)
    .then(result => res.send(result))
    .catch(next);
});

module.exports = router;
