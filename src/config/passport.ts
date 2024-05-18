import bcrypt from 'bcrypt';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import env from '../env';
import prisma from '../prisma';

// Only needed if you are using session-based authentication
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: string, cb) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});

// Local strategy for username and password login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, cb) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!existingUser || !existingUser.password) {
          return cb(null, false, { message: 'Incorrect email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
          return cb(null, false, { message: 'Incorrect email or password.' });
        }

        const { password: userPassword, ...user } = existingUser;
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

// JWT strategy for token authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_ACCESS_SECRET,
    },
    async (jwtPayload, cb) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwtPayload.id,
          },
        });

        if (!user) {
          return cb(null, false);
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);
