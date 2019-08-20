const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const commitRoutes = require('./commit.route');
const commitCommentRoutes = require('./commit-comment.route');
const repoRoutes = require('./repo.route');
const organizationRoutes = require('./organization.route');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/commits', commitRoutes);
  app.use('/api/commit-comments', commitCommentRoutes);
  app.use('/api/repo', repoRoutes);
  app.use('/api/organizations', organizationRoutes);
};
