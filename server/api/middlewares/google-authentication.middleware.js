const passport = require('passport');

const scope = process.env.GOOGLE_SCOPE;

const googleMiddleware = passport.authenticate('google', { scope });

const googleCallbackMiddleware = passport.authenticate('google', {
  failureRedirect: '/login',
  scope
});

module.exports = { googleMiddleware, googleCallbackMiddleware };
