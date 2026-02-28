const mongoose = require("mongoose");
// create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [30, "Category name must be at most 30 characters"],
    },
    // a and b => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  // schema options
  // createdAt, updatedAt
  { timestamps: true },
);

// create model
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
