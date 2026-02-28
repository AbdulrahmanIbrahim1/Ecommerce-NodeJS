const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddelware");
const { default: slugify } = require("slugify");
const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    // .isLength({ max: 30 })
    // .withMessage("User name must be at most 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      // Check if the email already exists in the database
      return userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
        return true;
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject(new Error("Passwords do not match"));
      }
      return true;
    }),

  //   check("profileImage")
  //     .optional()
  //     .isURL()
  //     .withMessage("Profile image must be a valid URL"),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      // Check if the email already exists in the database
      return userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
        return true;
      });
    }),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom(async (value, { req }) => {
      // verify current password
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      const isMatch = bcrypt.compareSync(
        req.body.currentPassword,
        user.password,
      );
      if (!isMatch) {
        return Promise.reject(new Error("Current password is incorrect"));
      }
      // verify new password and password confirm match
      if (value !== req.body.password) {
        return Promise.reject(new Error("Passwords do not match"));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value, { req }) => {
      return userModel.findOne({ email: value }).then((user) => {
        if (user && user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error("Email already in use"));
        }
      });
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),

  validatorMiddleware,
];

exports.changeLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom(async (value, { req }) => {
      // verify current password
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      const isMatch = bcrypt.compareSync(
        req.body.currentPassword,
        user.password,
      );
      if (!isMatch) {
        return Promise.reject(new Error("Current password is incorrect"));
      }
      // verify new password and password confirm match
      if (value !== req.body.password) {
        return Promise.reject(new Error("Passwords do not match"));
      }
      return true;
    }),
  validatorMiddleware,
];
