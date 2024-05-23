import { Router } from 'express';

import { createPet, getPetsByUser, updatePet } from '@controllers/pets';
import requiresAuth from '@middlewares/requiresAuth';
import * as s from '@middlewares/swaggers/pets';
import { validateRequest } from '@middlewares/validateRequest';
import { createPetRequestSchema, getPetsByUserRequestSchema, updatePetRequestSchema } from '@schema/pet';

const router = Router();

router.post('/pets', requiresAuth, validateRequest(createPetRequestSchema), createPet, s.createPet);
router.patch('/pets/:pet_id', requiresAuth, validateRequest(updatePetRequestSchema), updatePet, s.updatePet);
router.get('/users/:user_id/pets', validateRequest(getPetsByUserRequestSchema), getPetsByUser, s.getPets);

export default router;
