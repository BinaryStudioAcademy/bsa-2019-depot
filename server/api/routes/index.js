const authRoutes = require('./auth.route');
const userRoutes = require('./users.route');
const commitRoutes = require('./commit.route');
const commitCommentRoutes = require('./commit-comment.route');
const repoRoutes = require('./repos.route');
const organizationRoutes = require('./orgs.route');
const sshKeysRoutes = require('./ssh-keys.route');
const issuesRoutes = require('./issues.route');
const issueCommentsRoutes = require('./issue-comments.route');
const labelRoutes = require('./labels.route');
const filesRoutes = require('./files.route');

module.exports = app => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/commits', commitRoutes);
  app.use('/api/commit-comments', commitCommentRoutes);
  app.use('/api/repos', repoRoutes);
  app.use('/api/orgs', organizationRoutes);
  app.use('/api/keys', sshKeysRoutes);
  app.use('/api/issues', issuesRoutes);
  app.use('/api/issue-comments', issueCommentsRoutes);
  app.use('/api/labels', labelRoutes);
  app.use('/api/files', filesRoutes);
};
