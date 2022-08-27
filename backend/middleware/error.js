const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Something went wrong!";

  //wrong id error
  // if (err.name === "CastError") {
  //   const message = "Resource not found. Invalid id.";
  //   err = new ErrorHandler(400, message);
  // }

  res.status(err.status).json({
    success: false,
    message: err.message,
  });
};
