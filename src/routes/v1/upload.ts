import express from 'express';

import { uploadImage } from '@controllers/upload';
import upload from '@middlewares/image';
import { validateRequest } from '@middlewares/validateRequest';
import { uploadImageRequestSchema } from '@schema/upload';

const router = express.Router();

router.post('/image', upload.single('file'), validateRequest(uploadImageRequestSchema), uploadImage);

export default router;
