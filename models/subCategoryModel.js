const mongoose = require("mongoose");
// create schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory name must be unique"],
      required: [true, "SubCategory name is required"],
      minlength: [2, "SubCategory name must be at least 2 characters"],
      maxlength: [32, "SubCategory name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to a parent category"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
