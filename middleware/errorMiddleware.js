// Global Error Handling Middleware
const ApiError = require("../utils/apiError");

const handleJWTInvalidSignature = () =>
  new ApiError("Invalid token, please login again", 401);

const handleJWTTokenExpiredError = () =>
  new ApiError("Your token has expired, please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorForDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = handleJWTInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJWTTokenExpiredError();
    let error = { ...err };
    error.message = err.message;

    // 🟢 Mongo invalid ObjectId
    if (err.name === "CastError") {
      error = new ApiError("Invalid ID format", 400);
    }

    // 🟢 Mongo validation error
    if (err.name === "ValidationError") {
      error = new ApiError(err.message, 400);
    }

    return sendErrorForProduction(error, res);
  }
};

// Development Error
const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    success: false,
  });
};

// Production Error
// const sendErrorForProduction = (err, res) => {

//   return res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     success: false,
//   });
// };

const sendErrorForProduction = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Error غير متوقع (Bug)
  // console.error("ERROR 💥", err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong!",
  });
};

module.exports = globalError;
