const passport = require('passport');
const { scope } = require('../../config/google.config');

const googleMiddleware = passport.authenticate('google', { scope });

const googleCallbackMiddleware = passport.authenticate('google', {
  failureRedirect: '/login',
  scope
});

module.exports = { googleMiddleware, googleCallbackMiddleware };
