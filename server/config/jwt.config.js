const { ExtractJwt } = require('passport-jwt');

const secret = process.env.SECRET_KEY;
const expiresIn = '24h';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

module.exports = {
  secret,
  expiresIn,
  jwtOptions
};
