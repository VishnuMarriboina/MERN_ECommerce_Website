const mongoose = require("mongoose");

const genericVariantSchema = new mongoose.Schema({
  image_url:     { type: String, default: "No image found" },
  cost:          { type: Number, required: [true, "Cost is required"], min: 0 },
  count:         { type: Number, required: [true, "Count is required"], min: 0 },
  attributes:    { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  rating:        { type: Number, default: null, min: 0, max: 5 },
  ratingCount:   { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
});

const genericProductSchema = new mongoose.Schema(
  {
    category:    { type: String, required: [true, "Category is required"], trim: true },
    name:        { type: String, required: [true, "Product name is required"], trim: true },
    brand:       { type: String, required: [true, "Brand is required"], trim: true },
    description: { type: String, default: "" },
    attributes:  { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    variants:    [genericVariantSchema],
    addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Index for fast duplicate lookups (case-sensitive at DB level; service handles case-insensitive check)
genericProductSchema.index({ brand: 1, name: 1, category: 1 });

const GenericProduct = mongoose.model("GenericProduct", genericProductSchema, "generic-products");

module.exports = { GenericProduct };
