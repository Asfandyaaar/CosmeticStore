const ErrorHandler = require("../utils/errorHandler");
const asyncErrors = require("../middleware/AsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//register user
exports.registerUser = asyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample public id",
      url: "profile picture url",
    },
  });

  sendToken(user, 201, res);
});

//login user
exports.loginUser = asyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(400, "Please enter email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler(401, "User does not Exist"));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler(401, "Invalid credentials"));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = asyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
