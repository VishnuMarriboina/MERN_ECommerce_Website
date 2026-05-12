const mongoose = require("mongoose");

const imageUrlField = {
  type: String,
  default: "No image found",
  match: [/^https?:\/\/.+|^No image found$/, "Image URL must be a valid URL or 'No image found'"],
};

const materialEnum = { values: ["Leather", "Synthetic", "Canvas", "Mesh", "Rubber", "Foam"], message: "Invalid material" };
const soleEnum = { values: ["Rubber", "Foam", "Air", "PU", "TPU"], message: "Invalid sole type" };

const sandleSchema = new mongoose.Schema(
  {
    type_of_material: { type: String, required: [true, "Material type is required"], enum: materialEnum },
    brand: { type: String, required: [true, "Brand is required"], trim: true },
    color: { type: String, required: [true, "Color is required"], trim: true },
    sole_type: { type: String, required: [true, "Sole type is required"], enum: soleEnum },
    strap_type: { type: String, required: [true, "Strap type is required"], enum: materialEnum },
    category: { type: String, default: "Sandals" },
    variants: [
      {
        size: { type: String, required: [true, "Shoe size is required"] },
        sandal_type: {
          type: String,
          required: [true, "Sandal type is required"],
          enum: { values: ["Sandals", "Slippers"], message: "Invalid sandal type" },
        },
        cost: { type: Number, required: [true, "Cost is required"], min: [1, "Cost must be at least 1"], max: [100000, "Cost cannot exceed 100000"] },
        heel_height: {
          type: String,
          required: [true, "Heel height is required"],
          enum: { values: ["Low", "Medium", "High"], message: "Invalid heel height" },
        },
        count: { type: Number, required: [true, "Count is required"], min: [1, "Count must be at least 1"], max: [100000, "Count cannot exceed 100000"] },
        image_url: imageUrlField,
      },
    ],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const shoesSchema = new mongoose.Schema(
  {
    color: { type: String, required: [true, "Color is required"], trim: true },
    type_of_material: { type: String, required: [true, "Material type is required"], enum: materialEnum },
    brand: { type: String, required: [true, "Brand is required"], trim: true },
    sole_type: { type: String, required: [true, "Sole type is required"], enum: soleEnum },
    category: { type: String, default: "Shoes" },
    variants: [
      {
        size: { type: String, required: [true, "Shoe size is required"] },
        cost: { type: Number, required: [true, "Cost is required"], min: [1, "Cost must be at least 1"], max: [100000, "Cost cannot exceed 100000"] },
        count: { type: Number, required: [true, "Count is required"], min: [1, "Count must be at least 1"], max: [100000, "Count cannot exceed 100000"] },
        lacing_type: {
          type: String,
          required: [true, "Lacing type is required"],
          enum: { values: ["Lace-Up", "Slip-On", "Velcro"], message: "Invalid lacing type" },
        },
        shoe_type: {
          type: String,
          required: [true, "Shoe type is required"],
          enum: { values: ["Sneaker", "Running Shoes", "Canvas Shoes"], message: "Invalid shoe type" },
        },
        image_url: imageUrlField,
      },
    ],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Sandles = mongoose.model("Sandles", sandleSchema, "sandals");
const Shoes = mongoose.model("Shoes", shoesSchema, "shoes");

module.exports = { Sandles, Shoes };
