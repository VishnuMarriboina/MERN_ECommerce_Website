const mongoose = require("mongoose");

const productRatingSchema = new mongoose.Schema(
  {
    productId:    { type: mongoose.Schema.Types.ObjectId, required: true },
    variantId:    { type: mongoose.Schema.Types.ObjectId, required: true },
    productModel: { type: String, required: true },
    userId:       { type: mongoose.Schema.Types.ObjectId, required: true },
    rating:       { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

productRatingSchema.index({ productId: 1, variantId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("ProductRating", productRatingSchema);
