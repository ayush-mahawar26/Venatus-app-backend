import { gameModel } from "../../models/games.model.js";
import { postModel } from "../../models/post.model.js";
import { ApiResponse } from "../../utils/ApiReponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { io } from "../../app.js";

// get all post
const getPosts = async (req, res) => {
  const data = await postModel.find();
  return res.json(new ApiResponse(200, data, "Sucessfully get post"));
};

// add the post
const addPost = async (req, res) => {
  const { caption } = req.body;
  console.log("here");

  const user = req.user;
  const imgUrl = req.files.postimg;

  if (!imgUrl) {
    return res.json(new ApiResponse(400, {}, "No image found"));
  }

  const postOption = {
    folder: "posts",
    resource_type: "image",
    use_filename: true,
  };

  const imgPath = req.files?.postimg[0].path;
  const url = await uploadOnCloudinary(imgPath, postOption);

  const post = await postModel.create({
    caption: caption,
    postBy: user._id,
    postLikes: 0,
    postImage: url,
  });
  const postCreated = await post.save();

  if (!postCreated) {
    return res.json(new ApiResponse(500, {}, "Error Occured"));
  }

  return res.json(new ApiResponse(200, post, "Post created Successfully"));
};

// add like to post
const addLike = async (req, res) => {
  const postId = req.query["postid"];

  if (!postId)
    return res.json(new ApiResponse(500, {}, "PostId can't be null"));

  const post = await postModel.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: {
        postLikes: 1,
      },
    }
  );

  if (!post) return res.json(new ApiResponse(400, {}, "Error in post"));

  io.emit("likeupdated", {
    post: post,
    likedby: req.user,
  });

  return res.json(new ApiResponse(200, post, "Like updated"));
};

export { getPosts, addPost, addLike };
