import createHttpError from 'http-errors';
import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(createHttpError(400, 'No file uploaded!'));
    }
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
      cb(null, true);
    } else {
      cb(createHttpError(400, 'Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

export default upload;
