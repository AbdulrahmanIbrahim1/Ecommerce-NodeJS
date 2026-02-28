const SubCategory = require("../models/subCategoryModel");

const factory = require("./handlersFactory");
// const subCategoryModel = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.mainCategory && req.params.categoryId) {
    req.body.mainCategory = req.params.categoryId;
  }
  next();
};

// @desc Create new subCategory
// @route POST /api/v1/subCategories
// @access Private (admin)
exports.createSubCategory = factory.createOne(SubCategory);

// @desc Get specific subCategory by id
// @route GET /api/v1/subCategories/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory, {
  path: "mainCategory",
  select: "name -_id",
});

// nested route
// @route GET /api/v1/categories/:mainCategoryId/subCategories

exports.createFilteredObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { mainCategory: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// @desc Get all subCategories
// @route GET /api/v1/subCategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategory, {
  path: "mainCategory",
  select: "name -_id",
});

// @desc Update subCategory
// @route PUT /api/v1/subCategories/:id
// @access Private (admin)
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc delete subCategory
// @route DELETE /api/v1/subCategories/:id
// @access Private (admin)
exports.deleteSubCategory = factory.deleteOne(SubCategory);
