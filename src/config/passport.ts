import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../prisma";

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: string, cb) => {
  const user = await prisma.user.findUnique({ where: { id } });

  cb(null, user);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      try {
        var existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!existingUser || !existingUser.password) {
          return cb(null, false);
        }

        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!passwordMatch) {
          return cb(null, false);
        }

        const { password: userPassword, ...user } = existingUser;

        return cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);
