const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const scope = process.env.GOOGLE_SCOPE;

const googleMiddleware = passport.authenticate('google', { scope });

const googleCallbackMiddleware = passport.authenticate('google', {
  failureRedirect: '/login',
  scope
});

module.exports = { googleMiddleware, googleCallbackMiddleware };
