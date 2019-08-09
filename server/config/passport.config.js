const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userRepository = require('../data/repositories/user.repository');
const { jwtOptions } = require('./jwt.config');
const { clientID, clientSecret, callbackURL } = require('./google.config');
const cryptoHelper = require('../helpers/crypto.helper');

passport.use(
  'login',
  new LocalStrategy(async (loginInput, password, done) => {
    try {
      const user = loginInput.includes('@')
        ? await userRepository.getByEmail(loginInput)
        : await userRepository.getByUsername(loginInput);

      if (!user) {
        return done({ status: 401, message: 'Incorrect email or username' }, false);
      }
      return (await cryptoHelper.compare(password, user.password))
        ? done(null, user)
        : done({ status: 401, message: 'Password is incorrect' }, false);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  'register',
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    async ({ body: { email } }, username, password, done) => {
      try {
        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) return done({ status: 401, message: 'This email is already used' }, false);

        return done(null, {
          email,
          username,
          password: await cryptoHelper.encrypt(password)
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const user = await userRepository.getByEmail(profile.email);
      if (!user) {
        const newUser = await userRepository.addUser({ email: profile.email });
        return done(null, newUser);
      }
      return done(null, user);
    }
  )
);

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await userRepository.getUserById(jwtPayload.id);
      return user ? done(null, user) : done({ status: 401, message: 'Token is invalid.' }, null);
    } catch (err) {
      return done(err);
    }
  })
);
