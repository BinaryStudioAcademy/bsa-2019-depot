const passport = require('passport');

module.exports = passport.authenticate('register', { session: false });
