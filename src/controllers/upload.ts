import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';

import { UploadImageRequest } from '@schema/upload';
import firebaseAdmin from '@service/firebase';

const bucket = firebaseAdmin.storage().bucket();

export const uploadImage = async (req: UploadImageRequest, res: Response, next: NextFunction) => {
  const { type } = req.body;

  try {
    if (req.file === undefined) {
      throw createHttpError(400, 'No file uploaded!');
    }

    const file = req.file!;
    const blob = bucket.file(`${type.toLocaleLowerCase()}/${uuid()}.${file.originalname.split('.').pop()}`);
    const blobStream = blob.createWriteStream({});

    blobStream.on('error', (error) => {
      createHttpError(500, error);
    });

    blobStream.on('finish', async () => {
      res.status(201).json({
        message: 'File uploaded successfully',
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    next(error);
  }
};
