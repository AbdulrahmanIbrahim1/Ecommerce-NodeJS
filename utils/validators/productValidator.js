const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddelware");
const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");
const { default: slugify } = require("slugify");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Product name must be at most 100 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Product description must be at most 2000 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 20 })
    .withMessage("Product price must be at most 20 characters"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Product price after discount must be less than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Product colors must be an array with at least one element"),

  check("imageCover").notEmpty().withMessage("Product image cover is required"),

  check("images")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Product images must be an array with at least one element"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom((categoryID) => {
      return CategoryModel.findById(categoryID).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category found with id: ${categoryID}`),
          );
        }
      });
    }),

  check("subCategories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Product subCategories must be an array")

    // 1️⃣ validate MongoID format
    .custom((subCategoriesIDs) => {
      for (let id of subCategoriesIDs) {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error(`Invalid subCategory ID: ${id}`);
        }
      }
      return true;
    })

    // 2️⃣ check IDs exist in DB
    .custom(async (subCategoriesIDs) => {
      const subCategories = await SubCategoryModel.find({
        _id: { $in: subCategoriesIDs },
      });

      if (subCategories.length !== subCategoriesIDs.length) {
        throw new Error("Some subCategories IDs are invalid");
      }
      return true;
    })

    // 3️⃣ check subCategories belong to category
    .custom(async (subCategoriesIDs, { req }) => {
      const subCategories = await SubCategoryModel.find({
        _id: { $in: subCategoriesIDs },
        mainCategory: req.body.category,
      });

      if (subCategories.length !== subCategoriesIDs.length) {
        throw new Error(
          `subCategories not belong to category ${req.body.category}`,
        );
      }
      return true;
    }),

  check("brand").optional().isMongoId().withMessage("Invalid brand ID format"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsAverage must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product ratingsAverage must be between 1 and 5"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  body("title").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];
