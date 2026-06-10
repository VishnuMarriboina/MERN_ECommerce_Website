const ProductRating   = require("../models/productRating.model");
const { GenericProduct } = require("../models/generic.model");

// POST /api/products/rate
// Body: { productId, variantId, productModel, rating }
const rateProduct = async (req, res) => {
  try {
    const { productId, variantId, rating } = req.body;
    const userId = req.user.userId;

    if (!productId || !variantId || rating == null) {
      return res.status(400).json({ success: false, message: "productId, variantId and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const product = await GenericProduct.findOne({ _id: productId, "variants._id": variantId });
    if (!product) return res.status(404).json({ success: false, message: "Product or variant not found" });

    const variant      = product.variants.id(variantId);
    const currentRating = variant.rating || 0;
    const currentCount  = variant.ratingCount || 0;

    const existing = await ProductRating.findOne({ productId, variantId, userId });

    let newAvg, newCount;

    if (existing) {
      const oldRating = existing.rating;
      existing.rating = rating;
      await existing.save();
      const newTotal = currentRating * currentCount - oldRating + rating;
      newAvg  = parseFloat((newTotal / currentCount).toFixed(2));
      newCount = currentCount;
    } else {
      await ProductRating.create({ productId, variantId, productModel: "generic", userId, rating });
      newCount = currentCount + 1;
      newAvg   = parseFloat(((currentRating * currentCount + rating) / newCount).toFixed(2));
    }

    await GenericProduct.findOneAndUpdate(
      { _id: productId, "variants._id": variantId },
      { $set: { "variants.$.rating": newAvg, "variants.$.ratingCount": newCount } }
    );

    return res.status(200).json({
      success: true,
      message: existing ? "Rating updated" : "Rating submitted",
      data: { rating: newAvg, ratingCount: newCount, userRating: rating },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Already rated this variant" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/my-rating?productId=&variantId=
const getMyRating = async (req, res) => {
  try {
    const { productId, variantId } = req.query;
    const userId = req.user.userId;
    if (!productId || !variantId) {
      return res.status(400).json({ success: false, message: "productId and variantId required" });
    }
    const record = await ProductRating.findOne({ productId, variantId, userId });
    res.json({ success: true, data: record ? { userRating: record.rating } : { userRating: null } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { rateProduct, getMyRating };
