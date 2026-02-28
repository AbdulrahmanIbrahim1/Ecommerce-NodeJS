const BrandModel = require("../models/brandModel");

const factory = require("./handlersFactory");

// @desc Get all brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(BrandModel);

// @desc Get specific brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(BrandModel);

// @desc Create new brand
// @route POST /api/v1/brands
// @access Private (admin)
exports.createBrand = factory.createOne(BrandModel);

// @desc Update brand
// @route PUT /api/v1/brands/:id
// @access Private (admin)
exports.updateBrand = factory.updateOne(BrandModel);

// @desc delete brand
// @route DELETE /api/v1/brands/:id
// @access Private (admin)
exports.deleteBrand = factory.deleteOne(BrandModel);
