const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
};
