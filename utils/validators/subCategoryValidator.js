const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddelware");
const { default: slugify } = require("slugify");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2 })
    .withMessage("SubCategory name must be at least 2 characters")
    .isLength({ max: 30 })
    .withMessage("SubCategory name must be at most 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("mainCategory")
    .notEmpty()
    .withMessage("mainCategory is required")
    .isMongoId()
    .withMessage("Invalid mainCategory ID format"),
  check("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Invalid categoryId format"),

  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory ID is required")
    .isMongoId()
    .withMessage("Invalid subCategory ID format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory ID is required")
    .isMongoId()
    .withMessage("Invalid subCategory ID format"),
  validatorMiddleware,
];
