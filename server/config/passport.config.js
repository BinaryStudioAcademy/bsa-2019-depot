import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserRepository from '../data/repositories/user.repository';

passport.use(
  'login',
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = username.includes('@')
        ? UserRepository.getByEmail(username)
        : UserRepository.getByUsername(username);

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
