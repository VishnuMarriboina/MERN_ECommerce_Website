const { Shirts, Tshirts } = require("../../models/Cloths");
const { Belts, Watches } = require("../../models/Accessories");
const { Shoes, Sandles } = require("../../models/FootWears");

const modelRegistry = {
  shirt: Shirts,
  tshirt: Tshirts,
  belt: Belts,
  watch: Watches,
  shoe: Shoes,
  sandal: Sandles,
};

const pluralToSingular = {
  shirts: "shirt", tshirts: "tshirt", belts: "belt",
  watches: "watch", shoes: "shoe", sandals: "sandal",
};

const normalizeModel = (model) => {
  let key = model.trim().toLowerCase();
  return (
    pluralToSingular[key] ||
    (key.endsWith("es") ? key.slice(0, -2) : key.endsWith("s") ? key.slice(0, -1) : key)
  );
};

// GET /internal/stock/:model/:productId/:variantId
const getStock = async (req, res) => {
  try {
    const { model, productId, variantId } = req.params;
    const Model = modelRegistry[normalizeModel(model)];
    if (!Model) return res.status(400).json({ error: "Invalid product model" });

    const product = await Model.findOne(
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
    const { model, id } = req.params;
    const Model = modelRegistry[normalizeModel(model)];
    if (!Model) return res.status(400).json({ error: "Invalid product model" });

    const product = await Model.findById(id).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /internal/stock/decrement
// Body: { model, productId, variantId, quantity }
// Atomically decrements variant stock and returns price + product snapshot for order creation
const decrementStock = async (req, res) => {
  try {
    const { model, productId, variantId, quantity } = req.body;
    if (!model || !productId || !variantId || !quantity) {
      return res.status(400).json({ error: "model, productId, variantId, quantity are required" });
    }

    const Model = modelRegistry[normalizeModel(model)];
    if (!Model) return res.status(400).json({ error: "Invalid product model" });

    const product = await Model.findOneAndUpdate(
      {
        _id: productId,
        "variants._id": variantId,
        "variants.count": { $gte: quantity },
      },
      { $inc: { "variants.$.count": -quantity } },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({ error: "Out of stock or product not found" });
    }

    const variant = product.variants.id(variantId);
    res.json({ success: true, price: variant.cost, product: product.toObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStock, getProduct, decrementStock };
