const mongoose = require("mongoose");
// create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [3, "Brand name must be at least 3 characters"],
      maxlength: [30, "Brand name must be at most 30 characters"],
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
const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;

