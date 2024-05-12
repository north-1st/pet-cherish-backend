import { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError from 'http-errors';
import multer, { MulterError } from 'multer';

export const uploadHandler = (upload: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(createHttpError(400, err.message));
    } else if (err) {
      next(err);
    } else {
      next();
    }
  });
};

export const imageUpload = multer({
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
    }
  },
});
