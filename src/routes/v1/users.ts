import express from 'express';
import passport from 'passport';

import * as UsersController from '../../controllers/users';
import env from '../../env';
import requiresAuth from '../../middlewares/requiresAuth';
import { imageUpload } from '../../middlewares/uploadHandler';

const router = express.Router();

router
  .route('/:user_id/profile')
  .get(requiresAuth, UsersController.getUser)
  .patch(requiresAuth, imageUpload.single('avatar'), UsersController.updateUser);

router.post('/signup', UsersController.signUp);

router.post('/login', passport.authenticate('local', { session: false }), UsersController.logIn);

router.post('/logout', UsersController.logOut);

export default router;
