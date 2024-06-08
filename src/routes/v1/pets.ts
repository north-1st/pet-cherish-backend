import { Router } from 'express';

import { createPet, deletePet, getPetsByUser, updatePet } from '@controllers/pets';
import requiresAuth from '@middlewares/requiresAuth';
import * as s from '@middlewares/swaggers/pets';
import { validateRequest } from '@middlewares/validateRequest';
import {
  createPetRequestSchema,
  deletePetRequestSchema,
  getPetsByUserRequestSchema,
  updatePetRequestSchema,
} from '@schema/pet';

const router = Router();

router.post('/pets', requiresAuth, validateRequest(createPetRequestSchema), createPet, s.createPet);
router.patch('/pets/:pet_id', requiresAuth, validateRequest(updatePetRequestSchema), updatePet, s.updatePet);
router.delete('/pets/:pet_id', requiresAuth, validateRequest(deletePetRequestSchema), deletePet);
router.get('/users/:user_id/pets', validateRequest(getPetsByUserRequestSchema), getPetsByUser, s.getPets);

export default router;
