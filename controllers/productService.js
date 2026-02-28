const ProductModel = require("../models/productModel");

const factory = require("./handlersFactory");

// @desc Get all products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(
  ProductModel,
  {
    path: "category subCategories brand",
    select: "name -_id",
  },
  "Products",
);

// @desc Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(ProductModel, {
  path: "category subCategories brand",
  select: "name -_id ",
});

// @desc Create new product
// @route POST /api/v1/products
// @access Private (admin)
exports.createProduct = factory.createOne(ProductModel);
// @desc Update product
// @route PUT /api/v1/products/:id
// @access Private (admin)
exports.updateProduct = factory.updateOne(ProductModel);
// @desc delete product
// @route DELETE /api/v1/products/:id
// @access Private (admin)
exports.deleteProduct = factory.deleteOne(ProductModel);
