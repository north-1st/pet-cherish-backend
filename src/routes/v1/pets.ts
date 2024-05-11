import { Router } from 'express';

import * as PetController from '@controllers/pets';

const router = Router();

router.post('/', PetController.createPet);

export default router;
