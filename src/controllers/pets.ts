import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';

import prisma, { prismaExclude } from '@prisma';
import { CreatePetRequest, GetPetRequest, UpdatePetRequest } from '@schema/pet';

export const createPet = async (req: CreatePetRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.user_id,
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    await prisma.pet.create({
      data: {
        owner_user_id: req.params.user_id,
        ...req.body,
      },
    });
    res.status(201).json({ message: 'Pet created successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPets = async (req: GetPetRequest, res: Response, next: NextFunction) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        owner_user_id: req.params.user_id,
      },
      select: prismaExclude('Pet', ['owner_user_id', 'created_at', 'updated_at']),
    });

    res.status(200).json({
      data: pets,
      message: 'Get pets successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req: UpdatePetRequest, res: Response, next: NextFunction) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: req.params.pet_id,
      },
    });

    if (!pet) {
      throw createHttpError(404, 'Pet not found');
    }

    await prisma.pet.update({
      where: {
        id: req.params.pet_id,
      },
      data: {
        ...req.body,
      },
    });
    res.status(200).json({ message: 'Update pet successfully' });
  } catch (error) {
    next(error);
  }
};
