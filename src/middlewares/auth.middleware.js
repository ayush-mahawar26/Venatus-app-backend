import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiReponse.js";

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "No token found !!"));

    const isTokenValid = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!isTokenValid)
      return res.status(400).json(new ApiResponse(400, {}, "Invalid token"));

    const user = await userModel
      .findById(isTokenValid?.id)
      .select("-password -refreshToken");
    if (!user)
      return res.status(400).json(new ApiResponse(400, {}, "Not valid user"));

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
};

export { verifyJwt };
