import { urlencoded } from "express";
import { gameModel } from "../../models/games.model.js";
import { userModel } from "../../models/user.model.js";
import { userRoutes } from "../../routes/user.routes.js";
import { ApiResponse } from "../../utils/ApiReponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const updateProfile = async (req, res) => {
  const { fullName, ign, phoneNumber } = req.body;

  const user = req.user;

  let avtarFile = req.files.avtar;

  let avtarUrl =
    "https://as1.ftcdn.net/v2/jpg/05/71/35/06/1000_F_571350664_jCv3SsOqFzrmtRb43HPxmhCU7TUCYTps.jpg";

  const option = {
    public_id: `${user._id}`,
    folder: `${user._id}/avtar`,
    resource_type: "image",
    overwrite: true,
    unique_filename: false,
    use_filename: true,
  };

  if (avtarFile) {
    avtarFile = req.files?.avtar[0].path;
    avtarUrl = await uploadOnCloudinary(avtarFile, option);
  }

  user.avtar = avtarUrl;
  user.fullName = fullName;
  user.ign = ign;
  user.phoneNumber = phoneNumber;
  user.profileCompleted = true;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, user, "profile updated"));
};

const addGame = async (req, res) => {
  const { gameName, imgUrl } = req.body;

  if (gameName === "" || imgUrl === "") {
    // throw new ApiError(400 , "Fill all Response")
    return res.status(400).json(new ApiResponse(400, {}, "Fill all details"));
  }

  const game = await gameModel.create({
    gameName,
    imgUrl,
  });

  if (!game)
    return res.status(500).json(new ApiResponse(500, {}, "Unable to add game"));

  return res
    .status(200)
    .json(new ApiResponse(200, game, "Game added successfully !!"));
};

const getUserProfile = async (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(500).json(new ApiResponse(500, {}, "No user found"));

  return res.status(200).json(new ApiResponse(200, user, "user fetched"));
};

const getVerifiedDetail = async (req, res) => {
  const user = req.user;

  if (!user)
    return res.status(500).json(new ApiResponse(500, false, "No user found"));

  const isVerified = user.isVerified;
  console.log(isVerified);

  if (isVerified)
    return res.status(200).json(new ApiResponse(200, true, "User verified"));

  return res.status(200).json(new ApiResponse(200, false, "Not verified yet"));
};

export { updateProfile, addGame, getUserProfile, getVerifiedDetail };
