import express from "express";
import passport from "passport";
import * as UsersController from "../../controllers/users";

const router = express.Router();

router.post("/signup", UsersController.signUp);

router.post("/login", passport.authenticate("local"), (req, res) =>
  res.status(200).json({
    status: true,
    message: "login successd",
    data: req.user,
  })
);

router.post("/logout", UsersController.logOut);

export default router;