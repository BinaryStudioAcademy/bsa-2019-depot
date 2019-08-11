const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const commitRoutes = require('./commit.route');
const repoRoutes = require('./repo.route');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/commit', commitRoutes);
  app.use('/api/repo', repoRoutes);
};
