import express from 'express';
import passport from 'passport';

import * as s from '@middlewares/swaggers/users';

import * as UsersController from '../../controllers/users';
import requiresAuth from '../../middlewares/requiresAuth';

const router = express.Router();

router.get('/me', UsersController.getAuthenticatedUser, s.getAuthenticatedUser);

router
  .route('/:userid/profile')
  .get(requiresAuth, UsersController.getUser, s.getUser)
  .patch(requiresAuth, UsersController.updateUser, s.updateUser);

router.post('/signup', UsersController.signUp, s.signUp);

router.post('/login', passport.authenticate('local', { session: false }), UsersController.logIn, s.logIn);

router.post('/logout', UsersController.logOut, s.logOut);

export default router;
