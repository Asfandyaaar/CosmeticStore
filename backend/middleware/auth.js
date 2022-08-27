const ErrorHandler = require("../utils/errorHandler");
const AsyncErrors = require("./AsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticated = AsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler(401, "Please login to access this resource"));
  }

  const data = jwt.verify(token, process.env.SECRET_KEY);
  console.log(data.id);
  req.user = await User.findById(data.id);
  next();
});
