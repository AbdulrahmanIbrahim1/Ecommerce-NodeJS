const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const factory = require("./handlersFactory");
const generateToken = require("../utils/generateToken");

// @desc Get all users
// @route GET /api/v1/users
// @access private (admin)
exports.getUsers = factory.getAll(UserModel);

// @desc Get specific user by id
// @route GET /api/v1/users/:id
// @access Public
exports.getUser = factory.getOne(UserModel);

// @desc Create new user
// @route POST /api/v1/users
// @access Private (admin)
exports.createUser = factory.createOne(UserModel);

// @desc Update user
// @route PUT /api/v1/users/:id
// @access Private (admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      slug: req.body.slug,
      phone: req.body.phone,
      pprofileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(
      new ApiError(`No document found with this id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    document,
  });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(
      new ApiError(`No document found with this id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    document,
  });
});

// @desc delete user
// @route DELETE /api/v1/users/:id
// @access Private (admin)
exports.deleteUser = factory.deleteOne(UserModel);

// @desc logged user data
// @route GET /api/v1/users/getMe
// @access private/protected (user)
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc update logged user password
// @route PUT /api/v1/users/changeMyPassword
// @access private/protected (user)
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!user) {
    return next(
      new ApiError(`No user found with this id: ${req.user._id}`, 404),
    );
  }
  const token = generateToken(user._id);
  res.status(200).json({
    success: true,
    user,
    token,
  });
});

// @desc update logged user data without password
// @route PUT /api/v1/users/updateMe
// @access private/protected (user)
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true },
  );
  res.status(200).json({
    success: true,
    data: updateUser,
  });
});

// @desc deactive logged user
// @route DELETE /api/v1/users/deleteMe
// @access private/protected (user)
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    success: true,
    data: null,
  });
});
// @desc active logged user
// @route PUT /api/v1/users/activeMe
// @access private/protected (user)
exports.activeLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: true });
  res.status(204).json({
    success: true,
    data: null,
  });
});
