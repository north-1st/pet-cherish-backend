import express from 'express';

import { uploadImage } from '@controllers/upload';
import upload from '@middlewares/image';
import { validateMiddleware } from '@middlewares/validatorMiddleware';
import { uploadImageRequestSchema } from '@schema/upload';

const router = express.Router();

router.post('/image', upload.single('file'), validateMiddleware(uploadImageRequestSchema), uploadImage);

export default router;
