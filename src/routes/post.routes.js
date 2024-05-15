import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addLike,
  addPost,
  getPosts,
} from "../controllers/post.controllers/post.controllers.js";

const postRoutes = Router();

// add post
postRoutes.route("/addpost").post(
  upload.fields([
    {
      name: "postimg",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  addPost
);

postRoutes.route("/get").get(getPosts);
postRoutes.route("/like?:id").get(verifyJwt, addLike);

export { postRoutes };
