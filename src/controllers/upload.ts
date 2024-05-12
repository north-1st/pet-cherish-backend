import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';

import { GetSignedUrlConfig } from '@google-cloud/storage';
import { UploadImageRequest } from '@schema/upload';
import { bucket } from '@service/firebase';

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
      const config: GetSignedUrlConfig = {
        action: 'read',
        expires: '03-01-2500', // 有效期限
      };

      blob.getSignedUrl(config, (err, publicUrl) => {
        if (err) {
          createHttpError(500, err);
        }

        res.status(201).json({
          data: publicUrl,
        });
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    next(error);
  }
};
