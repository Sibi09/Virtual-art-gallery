import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../model/User';
import bcrypt from 'bcryptjs';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Hibás e-mail.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Hibás jelszó.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  return passport;
};
