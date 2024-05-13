import { RequestHandler } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import env from "../env";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUser = req.user;

  try {
    if (!authenticatedUser) throw createHttpError(401);

    const user = await prisma.user.findUnique({
      where: {
        id: authenticatedUser.id,
      },
      omit: {
        password: true,
      },
    });

    res.status(200).json({
      status: true,
      message: "get auth user successd",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByUserId: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userid,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      status: true,
      message: "get user successd",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

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
      omit: {
        password: true,
      },
    });

    const accessToken = jwt.sign({ id: newUser.id }, env.JWT_ACCESS_SECRET, {
      expiresIn: "7d",
    });

    req.logIn(newUser, (error) => {
      if (error) throw error;
      res.status(201).json({
        status: true,
        message: "register successd",
        data: {
          ...newUser,
          accessToken,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const logIn: RequestHandler = (req, res) => {
  const accessToken = jwt.sign({ id: req.user?.id }, env.JWT_ACCESS_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    status: true,
    message: "login successd",
    data: {
      ...req.user,
      accessToken,
    },
  });
};

export const logOut: RequestHandler = (req, res) => {
  req.logOut((error) => {
    if (error) throw error;
    res.sendStatus(200);
  });
};
