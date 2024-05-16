import { Router } from 'express';

import { createPet, getPets, updatePet } from '@controllers/pets';
import { validateRequest } from '@middlewares/validateRequest';
import { createPetRequestSchema, getPetRequestSchema, updatePetRequestSchema } from '@schema/pet';

const router = Router();

router.post('/users/:user_id/pets', validateRequest(createPetRequestSchema), createPet);
router.get('/users/:user_id/pets', validateRequest(getPetRequestSchema), getPets);
router.patch('/pets/:pet_id', validateRequest(updatePetRequestSchema), updatePet);

export default router;
