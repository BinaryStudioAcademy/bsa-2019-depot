const authRoutes = require('./auth.route');
const userRoutes = require('./users.route');
const commitRoutes = require('./commit.route');
const commitCommentRoutes = require('./commit-comment.route');
const repoRoutes = require('./repos.route');
const organizationRoutes = require('./orgs.route');
const sshKeysRoutes = require('./ssh-keys.route');
const issuesRoutes = require('./issues.route');
const issueCommentsRoutes = require('./issue-comments.route');
const collaborators = require('./collaborators.route');
const labelRoutes = require('./labels.route');
const filesRoutes = require('./files.route');
const pullsRoutes = require('./pulls.route');
const pullCommentsRoutes = require('./pull-comments.route');
const pullReviewersRoute = require('./pull-reviewers.route');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/commits', commitRoutes);
  app.use('/api/commit-comments', commitCommentRoutes);
  app.use('/api/repos', repoRoutes);
  app.use('/api/orgs', organizationRoutes);
  app.use('/api/keys', sshKeysRoutes);
  app.use('/api/issues', issuesRoutes);
  app.use('/api/issue-comments', issueCommentsRoutes);
  app.use('/api/collaborators', collaborators);
  app.use('/api/labels', labelRoutes);
  app.use('/api/files', filesRoutes);
  app.use('/api/pulls', pullsRoutes);
  app.use('/api/pull-comments', pullCommentsRoutes);
  app.use('/api/pull-reviewers', pullReviewersRoute);
};
