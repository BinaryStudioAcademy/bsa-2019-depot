import authRoutes from './auth.routes';

export default (app) => {
  app.use('/auth', authRoutes);
};
