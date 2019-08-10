const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const commitRoutes = require('./commit.route');
const repoRoutes = require('./repo.route');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/commit', commitRoutes);
  app.use('api/repo', repoRoutes);
};
