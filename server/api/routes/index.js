import authRoutes from './auth.route';

export default (app) => {
  app.use('/auth', authRoutes);
};
