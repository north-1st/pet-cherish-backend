import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prisma from "../prisma";
import bcrypt from "bcrypt";

interface SignUpBody {
  real_name: string;
  email: string;
  password: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { real_name, email, password: passwordRaw } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw createHttpError(409, "User already taken");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await prisma.user.create({
      data: {
        real_name,
        email,
        password: passwordHashed,
      },
    });

    const { password: userPassword, ...user } = newUser;

    req.logIn(user, (error) => {
      if (error) throw error;
      res.status(201).json({
        status: true,
        message: "register successd",
        data: user,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = (req, res) => {
  req.logOut((error) => {
    if (error) throw error;
    res.sendStatus(200);
  });
};
