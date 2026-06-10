const { GenericProduct } = require("../../models/generic.model");
const MSGS = require("../../constants/product.messages");

// All products now live in GenericProduct — model param accepted for compatibility but ignored
const getModel = () => GenericProduct;

// GET /internal/stock/:model/:productId/:variantId
const getStock = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const product = await getModel().findOne(
      { _id: productId, "variants._id": variantId },
      { "variants.$": 1 }
    );
    const count = product?.variants?.[0]?.count ?? 0;
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /internal/products/:model/:id
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getModel().findById(id).lean();
    if (!product) return res.status(404).json({ error: MSGS.NOT_FOUND });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /internal/stock/decrement
const decrementStock = async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    if (!productId || !variantId || !quantity) {
      return res.status(400).json({ error: MSGS.STOCK_REQUIRED_FIELDS });
    }

    const product = await getModel().findOneAndUpdate(
      { _id: productId, "variants._id": variantId, "variants.count": { $gte: quantity } },
      { $inc: { "variants.$.count": -quantity } },
      { new: true }
    );

    if (!product) return res.status(400).json({ error: MSGS.OUT_OF_STOCK });

    const variant = product.variants.id(variantId);
    res.json({ success: true, price: variant.cost, product: product.toObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /internal/purchase/increment
const incrementPurchaseCount = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Expected an array of { productId, variantId }" });
    }
    const ops = items.map(({ productId, variantId }) => {
      if (!productId || !variantId) return Promise.resolve();
      return getModel().findOneAndUpdate(
        { _id: productId, "variants._id": variantId },
        { $inc: { "variants.$.purchaseCount": 1 } }
      );
    });
    await Promise.allSettled(ops);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStock, getProduct, decrementStock, incrementPurchaseCount };
