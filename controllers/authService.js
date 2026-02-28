const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const generateToken = require("../utils/generateToken");

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1) Create new user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2) Generate token
  const token = generateToken(user._id);
  // 3) Send response to client side
  res.status(201).json({
    data: user,
    token,
  });
});

// @desc    login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // check if email and password in request body (validation)
  // check if user exist in database and password is correct
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // generate token
  const token = generateToken(user._id);
  // send response to client side
  res.status(200).json({
    data: user,
    token,
  });
});

exports.checkActive = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401,
      ),
    );
  }
  if (!user.active) {
    return next(
      new ApiError("User is not active, please active your account", 401),
    );
  }
  next();
});

// make sure that the user is authenticated (logedin) before access to protected route
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist in request header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in, please login to get access this route",
        401,
      ),
    );
  }
  // 2) verify token
  const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exist in database
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401,
      ),
    );
  }

  // 4) check if user changed password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(passwordChangedTimeStamp, decoded.iat);
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("User changed password, please login again", 401),
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc    authorize to specific roles (user permission)
// ['admin', 'manager']
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access to specific roles
    // 2) access to specific is registered (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });

// @desc    Forget password
// @route   POST /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404),
    );
  }
  // 2) if user exist, generate random 6 digit number and save it to db after encrypting it by crypto
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save hashed reset code to database
  user.passwordResetCode = hashedResetCode;
  // add expiration time for reset code (10 minutes)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false; // add field to check if reset code is verified or not
  await user.save();
  // 3) send email to user with reset code
  const message = `<h1>Hi ${user.name},</h1><p>You requested a password reset. Please use the following code to reset your password:</p><h2>${resetCode}</h2><p>This code is valid for 10 minutes.</p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>Souq Team</p>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset code sent to email",
  });
  // 4) create reset password endpoint to verify reset code and update user password
});

// @desc    Verify reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  // 2) check if reset code is correct (after encrypting it by crypto) and not expired
  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
    passwordResetVerified: false,
  });
  if (!user) {
    return next(new ApiError("Reset code is invalid or expired", 400));
  }
  // 3) if reset code is correct and not expired, update passwordResetVerified to true
  user.passwordResetVerified = true;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 4) send response to client side
  res.status(200).json({
    status: "success",
    message: "Reset code is verified, you can now reset your password",
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const user = await UserModel.findOne({
    email: req.body.email,
    // passwordResetVerified: true,
    // passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404),
    );
  }
  // 2) check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }
  // 3) if reset code is verified, update user password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetVerified = false;
  user.passwordResetExpires = undefined;
  await user.save();
  // if user changed password, generate new token
  const token = generateToken(user._id);
  // 4) send response to client side
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    token,
  });
});
