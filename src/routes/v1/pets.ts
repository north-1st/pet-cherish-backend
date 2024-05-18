import { Router } from 'express';

import { createPet, getPets, updatePet } from '@controllers/pets';
import * as s from '@middlewares/swaggers/pets';
import { validateRequest } from '@middlewares/validateRequest';
import { createPetRequestSchema, getPetRequestSchema, updatePetRequestSchema } from '@schema/pet';

const router = Router();

router.post('/users/:user_id/pets', validateRequest(createPetRequestSchema), createPet, s.createPet);
router.get('/users/:user_id/pets', validateRequest(getPetRequestSchema), getPets, s.getPets);
router.patch('/pets/:pet_id', validateRequest(updatePetRequestSchema), updatePet, s.updatePet);

export default router;
