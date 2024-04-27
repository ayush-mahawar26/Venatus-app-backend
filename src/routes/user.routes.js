import { Router } from "express";
import {
  loginUser,
  registerUser,
  validateEmail,
} from "../controllers/users.controllers/auth.controller.js";
import {
  addGame,
  getUserProfile,
  getVerifiedDetail,
  updateProfile,
} from "../controllers/users.controllers/profile.setup.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

// auth related routes
userRoutes.route("/auth/register").post(registerUser);
userRoutes.route(`/verify?:id`).get(validateEmail);
userRoutes.route("/auth/login").post(loginUser);

// profile related routes
userRoutes.route("/profile/update").post(
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateProfile
);
userRoutes.route("/profile/get").get(verifyJwt, getUserProfile);
userRoutes.route("/profile/user/verify").get(verifyJwt, getVerifiedDetail);

// Game Operation
userRoutes.route("/addgame").post(addGame);

export { userRoutes };
