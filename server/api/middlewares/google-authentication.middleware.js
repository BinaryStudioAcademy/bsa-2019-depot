import passport from 'passport';

export const googleMiddleware = passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
});

export const googleCallbackMiddleware = passport.authenticate('google', { failureRedirect: '/login' });
