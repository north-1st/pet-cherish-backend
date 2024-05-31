import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

import { Gender } from '@prisma/client';

import env from '../env';
import prisma from '../prisma';

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.user_id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      status: true,
      message: 'get user successd',
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

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
  const { real_name, email, password: passwordRaw } = req.body;

  if (!real_name) {
    res.status(400);
    throw new Error('username is required');
  }

  if (!email) {
    res.status(400);
    throw new Error('email is required');
  }

  if (!passwordRaw) {
    res.status(400);
    throw new Error('password is required');
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw createHttpError(409, `This email is already in use`);
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
      expiresIn: '7d',
    });

    req.logIn(newUser, (error) => {
      if (error) throw createHttpError(401, error);
      res.status(201).json({
        status: true,
        message: 'register successd',
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
  const { email, password } = req.body;
  console.log('🚀 ~ email:', email);
  console.log('🚀 ~ password:', password);

  if (!email) {
    res.status(400);
    throw new Error('email is required');
  }

  if (!password) {
    res.status(400);
    throw new Error('password is required');
  }

  const accessToken = jwt.sign({ id: req.user?.id, iat: Math.floor(Date.now() / 1000) }, env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });

  res.status(200).json({
    status: true,
    message: 'login successd',
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

export const updateUser: RequestHandler = async (req, res, next) => {
  const { phone, password: passwordRaw, avatar, nickname, birthdate, gender, self_introduction } = req.body;
  // const profilePic = req.file;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: req.params.user_id,
      },
    });

    if (!existingUser) {
      throw createHttpError(409, 'User not found.');
    }

    const data: {
      phone?: string;
      password?: string;
      lastPasswordChange?: Date;
      avatar?: string;
      nickname?: string;
      birthdate?: Date;
      gender?: Gender;
      self_introduction?: string;
    } = {};

    if (phone !== undefined) data.phone = phone;
    if (avatar !== undefined) data.avatar = avatar;
    if (nickname !== undefined) data.nickname = nickname;
    if (birthdate !== undefined) data.birthdate = new Date(birthdate);
    if (gender !== undefined) data.gender = gender as Gender;
    if (self_introduction !== undefined) data.self_introduction = self_introduction;

    if (passwordRaw) {
      const passwordHashed = await bcrypt.hash(passwordRaw, 10);
      data.password = passwordHashed;
      data.lastPasswordChange = new Date();
    }

    // if (profilePic) {
    //   const profilePicDestinationPath = '/uploads/profile-pictures/' + req.params.user_id + '.png';

    //   await sharp(profilePic.buffer)
    //     .resize(500, 500, { withoutEnlargement: true })
    //     .toFile('./' + profilePicDestinationPath);

    //   data.avatar = env.BACK_END_URL + profilePicDestinationPath + '?lastupdated=' + Date.now();
    // }

    const user = await prisma.user.update({
      where: {
        id: req.params.user_id,
      },
      data,
      omit: {
        password: true,
      },
    });

    const accessToken = jwt.sign({ id: user.id, iat: Math.floor(Date.now() / 1000) }, env.JWT_ACCESS_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      status: true,
      message: 'update user successd',
      data: {
        ...user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
