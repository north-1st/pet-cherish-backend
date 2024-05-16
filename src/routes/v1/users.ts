import express from "express";
import passport from "passport";
import * as UsersController from "../../controllers/users";
import requiresAuth from "../../middlewares/requiresAuth";

const router = express.Router();

router.get("/me", UsersController.getAuthenticatedUser);

router
  .route("/:userid/profile")
  .get(requiresAuth, UsersController.getUser)
  .patch(requiresAuth, UsersController.updateUser);

router.post("/signup", UsersController.signUp);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  UsersController.logIn
);

router.post("/logout", UsersController.logOut);

export default router;
