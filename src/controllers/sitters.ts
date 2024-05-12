import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { SitterStatus } from '@prisma/client';
import { ApplySitterRequest, GetSitterServiceRequest, UpdateSitterServiceRequest } from '@schema/sitter';

const userId = '663fd8ce5eeb13779e3a2f76';

export const applySitter = async (req: ApplySitterRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    await prisma.sitter.create({
      data: {
        user_id: userId,
        ...req.body,
      },
    });
    res.status(201).json({ message: 'Apply sitter successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSitterService = async (req: GetSitterServiceRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    if (sitter.status != SitterStatus.PASS && sitter.status != SitterStatus.ON_BOARD) {
      throw createHttpError(400, 'Sitter is not approved');
    }

    const sitterService = await prisma.sitter.findUnique({
      where: {
        user_id: userId,
      },
    });

    res.status(200).json({
      data: sitterService,
      message: 'Get sitter service successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSitterService = async (req: UpdateSitterServiceRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw createHttpError(404, 'Sitter not found');
    }

    if (!user.is_sitter) {
      throw createHttpError(400, 'Sitter is not approved');
    }

    const { photography_price, health_care_price, bath_price, walking_price } = req.body;

    if (!photography_price && !health_care_price && !bath_price && !walking_price) {
      throw createHttpError(400, 'Please provide at least one service');
    }

    await prisma.sitter.update({
      where: {
        user_id: userId,
      },
      data: {
        ...req.body,
        status: SitterStatus.ON_BOARD,
      },
    });

    res.status(200).json({
      message: 'Update sitter service successfully',
    });
  } catch (error) {
    next(error);
  }
};
