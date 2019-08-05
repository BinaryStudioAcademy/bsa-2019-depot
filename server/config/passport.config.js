import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import UserRepository from '../data/repositories/user.repository';

dotenv.config();

passport.use(
  'login',
  new LocalStrategy(async (loginInput, password, done) => {
    try {
      const user = loginInput.includes('@')
        ? UserRepository.getByEmail(loginInput)
        : UserRepository.getByUsername(loginInput);

      if (!user) {
        return done({ status: 401, message: 'Incorrect email or username' }, false);
      }
      return password === user.password
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
        const userByEmail = UserRepository.getByEmail(email);
        if (userByEmail) return done({ status: 401, message: 'This email is already used' }, false);

        const userByUsername = UserRepository.getByUsername(username);
        if (userByUsername) return done({ status: 401, message: 'This username is already user' }, false);

        return done(null, { email, username, password });
      } catch (err) {
        return done(err);
      }
    }
  )
);

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL
    },
    (accessToken, refreshToken, profile, done) => {
      const user = UserRepository.getByEmail(profile.emails[0]);

      if (!user) {
        return done({ status: 401, message: 'You need to sign up or connect your Google account' }, false);
      }

      return done(null, user);
    }
  )
);
