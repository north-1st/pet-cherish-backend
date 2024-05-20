import { Router } from 'express';

import { createPet, getPets, updatePet } from '@controllers/pets';
import requiresAuth from '@middlewares/requiresAuth';
import * as s from '@middlewares/swaggers/pets';
import { validateRequest } from '@middlewares/validateRequest';
import { createPetRequestSchema, getPetRequestSchema, updatePetRequestSchema } from '@schema/pet';

const router = Router();

router.post('/pets', requiresAuth, validateRequest(createPetRequestSchema), createPet, s.createPet);
router.patch('/pets/:pet_id', requiresAuth, validateRequest(updatePetRequestSchema), updatePet, s.updatePet);
router.get('/users/:user_id/pets', validateRequest(getPetRequestSchema), getPets, s.getPets);

export default router;
