const passport = require('passport');

module.exports = passport.authenticate('login', { session: false });
