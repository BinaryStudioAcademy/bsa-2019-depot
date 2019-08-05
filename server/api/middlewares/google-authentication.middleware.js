import passport from 'passport';

export const googleMiddleware = passport.authenticate('google', {
  scope: 'https://www.googleapis.com/auth/userinfo.email'
});

export const googleCallbackMiddleware = passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.googleapis.com/auth/userinfo.email' });
