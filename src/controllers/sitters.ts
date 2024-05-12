import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';

import prisma, { prismaExclude } from '@prisma';
import { SitterStatus } from '@prisma/client';
import { ApplySitterRequest, SitterRequest, UpdateSitterServiceRequest } from '@schema/sitter';

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
        status: SitterStatus.APPROVING,
      },
    });
    res.status(201).json({
      status: true,
      message: 'Apply sitter successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const sitterApprove = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
    });

    if (!sitter?.user) {
      throw createHttpError(404, 'User not found');
    }

    await prisma.sitter.update({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
      data: {
        status: SitterStatus.PASS,
        has_certificate: true,
        has_police_check: sitter.police_check_image != null,
        user: {
          update: {
            is_sitter: true,
          },
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Sitter has been approved',
    });
  } catch (error) {
    next(error);
  }
};

export const sitterReject = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    await prisma.sitter.update({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
      data: {
        status: SitterStatus.REJECTED,
        has_certificate: false,
        has_police_check: false,
        user: {
          update: {
            is_sitter: false,
          },
        },
      },
    });
    res.status(200).json({ status: true, message: 'Sitter has been rejected' });
  } catch (error) {
    next(error);
  }
};

export const getSitterService = async (req: SitterRequest, res: Response, next: NextFunction) => {
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
      select: prismaExclude('Sitter', [
        'id',
        'certificate_number',
        'certificate_image',
        'police_check_image',
        'created_at',
        'updated_at',
      ]),
    });

    res.status(200).json({
      status: true,
      data: sitterService,
      message: 'Get sitter service successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSitterService = async (req: UpdateSitterServiceRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    if (!sitter.user.is_sitter) {
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
      status: true,
      message: 'Update sitter service successfully',
    });
  } catch (error) {
    next(error);
  }
};
