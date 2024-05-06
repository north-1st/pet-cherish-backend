import { NextFunction, Response } from 'express';

import prisma from '@prisma';
import { CreatePetRequest } from '@schema/pet';

export const createPet = async (req: CreatePetRequest, res: Response, next: NextFunction) => {
  try {
    const { name, breed, size, character_list, has_microchipped, is_neutered, health_description, avatar_list } =
      req.body;
    const pet = await prisma.user.update({
      where: {
        id: req.params.user_id,
      },
      data: {
        pet_list: {
          create: {
            name,
            breed,
            size,
            character_list,
            has_microchipped,
            is_neutered,
            health_description,
            avatar_list,
          },
        },
      },
    });
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
};
