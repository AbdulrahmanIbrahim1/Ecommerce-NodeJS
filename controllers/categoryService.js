const CategoryModel = require("../models/categoryModel");

const factory = require("./handlersFactory");

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(CategoryModel);

// @desc Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc Create new category
// @route POST /api/v1/categories
// @access Private (admin)
exports.createCategory = factory.createOne(CategoryModel);

// @desc Update category
// @route PUT /api/v1/categories/:id
// @access Private (admin)
exports.updateCategory = factory.updateOne(CategoryModel);
// @desc delete category
// @route DELETE /api/v1/categories/:id
// @access Private (admin)

exports.deleteCategory = factory.deleteOne(CategoryModel);
