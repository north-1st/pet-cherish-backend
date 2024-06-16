import express from 'express';

import { uploadImage } from '@controllers/upload';
import requiresAuth from '@middlewares/requiresAuth';
import { imageUpload, uploadHandler } from '@middlewares/uploadHandler';
import { validateRequest } from '@middlewares/validateRequest';
import { uploadImageRequestSchema } from '@schema/upload';

const router = express.Router();

router.post(
  '/image',
  requiresAuth,
  uploadHandler(imageUpload.single('file')),
  validateRequest(uploadImageRequestSchema),
  uploadImage
);

export default router;
