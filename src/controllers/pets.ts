import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import {
  GetPetsByUserRequest,
  createPetRequestSchema,
  deletePetRequestSchema,
  updatePetRequestSchema,
} from '@schema/pet';

export const createPet = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = createPetRequestSchema.parse(_req);
    const userId = _req.user!.id;

    await prisma.pet.create({
      data: {
        owner_user_id: userId,
        ...req.body,
      },
    });
    res.status(201).json({
      status: true,
      message: 'Pet created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = updatePetRequestSchema.parse(_req);
    const userId = _req.user!.id;

    const pet = await prisma.pet.findUnique({
      where: {
        id: req.params.pet_id,
      },
    });

    if (!pet) {
      throw createHttpError(404, 'Pet not found');
    }

    if (pet.owner_user_id !== userId) {
      throw createHttpError(403, 'Forbidden');
    }

    await prisma.pet.update({
      where: {
        id: req.params.pet_id,
      },
      data: {
        ...req.body,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Update pet successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = deletePetRequestSchema.parse(_req);
    const userId = _req.user!.id;

    const pet = await prisma.pet.findUnique({
      where: {
        id: req.params.pet_id,
      },
    });

    if (!pet) {
      throw createHttpError(404, 'Pet not found');
    }

    if (pet.owner_user_id !== userId) {
      throw createHttpError(403, 'Forbidden');
    }

    await prisma.pet.delete({
      where: {
        id: req.params.pet_id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Delete pet successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getPetsByUser = async (req: GetPetsByUserRequest, res: Response, next: NextFunction) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        owner_user_id: req.params.user_id,
      },
    });

    res.status(200).json({
      status: true,
      data: pets,
      message: 'Get pets successfully',
    });
  } catch (error) {
    next(error);
  }
};
