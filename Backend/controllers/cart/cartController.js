const Cart = require("../../models/Cart");
const Order = require("../../models/orders");
const { Shirts, Tshirts } = require("../../models/Cloths");
const { Sandles, Shoes } = require("../../models/FootWears");
const { Belts, Watches } = require("../../models/Accessories");
const mongoose = require("mongoose");

const modelRegistry = {
  shirt: Shirts,
  tshirt: Tshirts,
  belt: Belts,
  shoe: Shoes,
  sandal: Sandles,
  watch: Watches,
};

const pluralToSingular = {
  shirts: "shirt",
  watches: "watch",
  shoes: "shoe",
  tshirts: "tshirt",
  belts: "belt",
  sandals: "sandal",
};

const normalizeModel = (model) => {
  let key = model.trim().toLowerCase();
  return (
    pluralToSingular[key] ||
    (key.endsWith("es")
      ? key.slice(0, -2)
      : key.endsWith("s")
      ? key.slice(0, -1)
      : key)
  );
};

const getVariantStock = async (Model, productId, variantId) => {
  const product = await Model.findOne(
    { _id: productId, "variants._id": variantId },
    { "variants.$": 1 }
  );
  return product?.variants?.[0]?.count ?? 0;
};

const getQtyInCart = async (userId, productId, variantId) => {
  const cart = await Cart.findOne(
    {
      userId,
      "items.productId": productId,
      "items.variantId": variantId,
    },
    { "items.$": 1 }
  );
  return cart?.items?.[0]?.quantity ?? 0;
};

/* =====================================================
   ADD TO CART (VALIDATION ONLY)
===================================================== */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, variantId, productModel, quantity = 1 } = req.body;

    if (!productId || !variantId || !productModel) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const modelKey = normalizeModel(productModel);
    const Model = modelRegistry[modelKey];
    if (!Model) return res.status(400).json({ error: "Invalid product model" });

    const stock = await getVariantStock(Model, productId, variantId);
    const alreadyInCart = await getQtyInCart(userId, productId, variantId);

    if (alreadyInCart + quantity > stock) {
      return res.status(400).json({
        error: `Only ${stock} items available`,
      });
    }

    await Cart.updateOne(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { upsert: true }
    );

    const result = await Cart.updateOne(
      {
        userId,
        "items.productId": productId,
        "items.variantId": variantId,
      },
      { $inc: { "items.$.quantity": quantity } }
    );

    if (result.matchedCount === 0) {
      await Cart.updateOne(
        { userId },
        {
          $push: {
            items: {
              productId,
              variantId,
              productModel: modelKey,
              quantity,
            },
          },
        }
      );
    }

    return res.status(200).json({
      message: "Added to cart",
      cart: await Cart.findOne({ userId }),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   GET CART
===================================================== */
const getCart = async (req, res) => {
  const userId = req.user.userId;
  const cart = await Cart.findOne({ userId }).lean();
  if (!cart) return res.json({ items: [] });

  const items = [];

  for (const item of cart.items) {
    const Model = modelRegistry[item.productModel];
    if (!Model) continue;

    const product = await Model.findById(item.productId).lean();
    const variant = product?.variants.find(
      (v) => v._id.toString() === item.variantId.toString()
    );
    if (!variant) continue;

    items.push({
      ...item,
      productDetails: {
        ...product,
        ...variant,
        variants: undefined,
      },
    });
  }

  res.json({ userId, items });
};

/* =====================================================
   UPDATE CART QTY (VALIDATION ONLY)
===================================================== */
const updateCartQty = async (req, res) => {
  const userId = req.user.userId;
  const { cartItemId, quantity } = req.body;

  if (!cartItemId || quantity < 1) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const cart = await Cart.findOne(
    { userId, "items._id": cartItemId },
    { "items.$": 1 }
  );
  if (!cart) return res.status(404).json({ error: "Item not found" });

  const item = cart.items[0];
  const Model = modelRegistry[item.productModel];

  const stock = await getVariantStock(Model, item.productId, item.variantId);

  if (quantity > stock) {
    return res.status(400).json({
      error: `Only ${stock} items available`,
    });
  }

  await Cart.updateOne(
    { userId, "items._id": cartItemId },
    { $set: { "items.$.quantity": quantity } }
  );

  res.json({
    message: "Quantity updated",
    cart: await Cart.findOne({ userId }),
  });
};

/* =====================================================
   REMOVE FROM CART
===================================================== */
const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { cartItemId } = req.body;

  await Cart.updateOne({ userId }, { $pull: { items: { _id: cartItemId } } });

  res.json({ message: "Item removed" });
};

/* =====================================================
   CLEAR CART
===================================================== */
const clearCart = async (req, res) => {
  const userId = req.user.userId;
  await Cart.updateOne({ userId }, { $set: { items: [] } });
  res.json({ message: "Cart cleared" });
};

/* =====================================================
   BUY ALL CART ITEMS (ONLY PLACE STOCK IS DEDUCTED)
===================================================== */
const buyAllCartItems = async (req, res) => {
  const userId = req.user.userId;
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "Cart empty" });
  }

  const purchasedItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const Model = modelRegistry[item.productModel];

    const product = await Model.findOneAndUpdate(
      {
        _id: item.productId,
        "variants._id": item.variantId,
        "variants.count": { $gte: item.quantity },
      },
      { $inc: { "variants.$.count": -item.quantity } },
      { new: true }
    );

    if (!product) continue;

    const variant = product.variants.id(item.variantId);
    totalAmount += variant.cost * item.quantity;

    purchasedItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: variant.cost,
    });
  }

  if (purchasedItems.length === 0) {
    return res.status(400).json({ error: "Out of stock" });
  }

  const order = await Order.create({
    userId,
    items: purchasedItems,
    totalAmount,
    status: "Confirmed",
    orderedDate: new Date(),
  });

  cart.items = [];
  await cart.save();

  res.json({ message: "Order placed", order });
};

module.exports = {
  addToCart,
  getCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  buyAllCartItems,
};
