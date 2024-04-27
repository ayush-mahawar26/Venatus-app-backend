import { io } from "../../app.js";
import { options } from "../../constants.js";
import { userModel } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiReponse.js";
import { sendEmail } from "../../utils/verification.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
  // check all the data
  const { email, password } = req.body;

  console.log(email);
  console.log(password);
  if (email === "" || password === "") {
    return res.status(400).json(new ApiResponse(400, {}, "Fill all details"));
  }

  const userExist = await userModel.findOne({ email });

  if (userExist) {
    return res.status(400).json(new ApiResponse(400, {}, "User already Exist"));
  }

  const user = await userModel.create({
    email,
    password,
    fullName: "",
    avtar: "",
    phoneNumber: "",
    ign: "",
  });

  const verificationToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();

  user.refreshToken = verificationToken;

  await user.save({ validateBeforeSave: false });

  if (!user) {
    return res.status(500).json(new ApiResponse(500, {}, "Server Error !!"));
  }

  const url = `http://localhost:8080/users/verify?verificationToken=${verificationToken}`;
  console.log(url);

  // FIXME: uncomment the code
  //   await sendEmail(url, email);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", user.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, verificationToken, accessToken },
        `Email sent to your email : ${email}`
      )
    );
};

const validateEmail = async (req, res) => {
  const token = req.query["verificationToken"];

  const verify = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await userModel.findOneAndUpdate(
    {
      _id: verify.id,
    },
    {
      isVerified: true,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid token"));
  } 

  return res.status(200).json(new ApiResponse(200, user, "User verified"));
};

const checkIsVerified = async (req, res) => {
  const { token } = req.body;
  const isTokenValid = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const userId = isTokenValid._id;

  if (!userId) {
    return res
      .json(400)
      .json(new ApiResponse(400, {}, "Invalid token Provided"));
  }

  const user = await userModel.findById(userId);

  if (!user)
    return new res.status(500).json(
      new ApiResponse(500, {}, "No user available")
    );

  const changeStream = userModel.watch([
    {
      $match: {
        "updateDescription.updatedFields.isVerified": { $exists: true },
        "fullDocument.userId": userId,
      },
    },
  ]);

  changeStream.on("change", (change) => {
    if (change.operationType === "update") {
      const doc = change.fullDocument;
      const userId = doc.userId;
      const isVerified = doc.isVerified;

      // Send the updated isVerified value to the specific user's WebSocket connection
      const userSocket = userSockets.get(userId);
      if (userSocket && userSocket.readyState === WebSocket.OPEN) {
        userSocket.send(JSON.stringify({ isVerified }));
      }
    }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, {}, "Fill all details"));
  }

  if (email.trim() === "" || password.trim() === "") {
    return res.status(400).json(new ApiResponse(400, {}, "Fill all details"));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "No user exist, try to create account"));
  }

  const verifyPasword = await user.isPasswordCorrect(password);

  if (!verifyPasword) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();

  const finalUser = await userModel
    .findOneAndUpdate(
      {
        email: email.trim(),
      },
      {
        refreshToken: refreshToken.trim(),
      },
      { new: true }
    )
    .select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: finalUser,
          refreshToken: refreshToken,
          accessToken: accessToken,
        },
        "SignIn Successfully !!!"
      )
    );
};

export { registerUser, validateEmail, loginUser };
