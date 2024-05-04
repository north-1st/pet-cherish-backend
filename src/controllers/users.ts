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

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
