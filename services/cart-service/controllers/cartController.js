const Cart = require("../models/Cart");

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3004";

const pluralToSingular = {
  shirts: "shirt", watches: "watch", shoes: "shoe",
  tshirts: "tshirt", belts: "belt", sandals: "sandal",
};

const normalizeModel = (model) => {
  let key = model.trim().toLowerCase();
  return (
    pluralToSingular[key] ||
    (key.endsWith("es") ? key.slice(0, -2) : key.endsWith("s") ? key.slice(0, -1) : key)
  );
};

const getVariantStock = async (model, productId, variantId) => {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/internal/stock/${model}/${productId}/${variantId}`);
  const data = await res.json();
  return data.count ?? 0;
};

const getQtyInCart = async (userId, productId, variantId) => {
  const cart = await Cart.findOne(
    { userId, "items.productId": productId, "items.variantId": variantId },
    { "items.$": 1 }
  );
  return cart?.items?.[0]?.quantity ?? 0;
};

/* =====================================================
   ADD TO CART
===================================================== */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, variantId, productModel, quantity = 1 } = req.body;

    if (!productId || !variantId || !productModel) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const modelKey = normalizeModel(productModel);
    if (!modelKey) return res.status(400).json({ error: "Invalid product model" });

    const stock = await getVariantStock(modelKey, productId, variantId);
    const alreadyInCart = await getQtyInCart(userId, productId, variantId);

    if (alreadyInCart + quantity > stock) {
      return res.status(400).json({ error: `Only ${stock} items available` });
    }

    await Cart.updateOne(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { upsert: true }
    );

    const result = await Cart.updateOne(
      { userId, "items.productId": productId, "items.variantId": variantId },
      { $inc: { "items.$.quantity": quantity } }
    );

    if (result.matchedCount === 0) {
      await Cart.updateOne(
        { userId },
        { $push: { items: { productId, variantId, productModel: modelKey, quantity } } }
      );
    }

    return res.status(200).json({ message: "Added to cart", cart: await Cart.findOne({ userId }) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   GET CART (enriched with product details from product-service)
===================================================== */
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId }).lean();
    if (!cart) return res.json({ items: [] });

    const items = [];

    for (const item of cart.items) {
      const productRes = await fetch(`${PRODUCT_SERVICE_URL}/internal/products/${item.productModel}/${item.productId}`);
      if (!productRes.ok) continue;

      const product = await productRes.json();
      const variant = product.variants?.find((v) => v._id.toString() === item.variantId.toString());
      if (!variant) continue;

      items.push({
        ...item,
        productDetails: { ...product, ...variant, variants: undefined },
      });
    }

    res.json({ userId, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE CART QTY
===================================================== */
const updateCartQty = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity < 1) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const cart = await Cart.findOne({ userId, "items._id": cartItemId }, { "items.$": 1 });
    if (!cart) return res.status(404).json({ error: "Item not found" });

    const item = cart.items[0];
    const stock = await getVariantStock(item.productModel, item.productId, item.variantId);

    if (quantity > stock) {
      return res.status(400).json({ error: `Only ${stock} items available` });
    }

    await Cart.updateOne(
      { userId, "items._id": cartItemId },
      { $set: { "items.$.quantity": quantity } }
    );

    res.json({ message: "Quantity updated", cart: await Cart.findOne({ userId }) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   REMOVE FROM CART
===================================================== */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItemId } = req.body;
    await Cart.updateOne({ userId }, { $pull: { items: { _id: cartItemId } } });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   CLEAR CART
===================================================== */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Cart.updateOne({ userId }, { $set: { items: [] } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   BUY ALL — calls product-service to decrement stock,
   then calls order-service to create the order
===================================================== */
const buyAllCartItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    const purchasedItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const decrementRes = await fetch(`${PRODUCT_SERVICE_URL}/internal/stock/decrement`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: item.productModel,
          productId: item.productId.toString(),
          variantId: item.variantId.toString(),
          quantity: item.quantity,
        }),
      });

      const result = await decrementRes.json();
      if (!result.success) continue;

      totalAmount += result.price * item.quantity;

      purchasedItems.push({
        productId: item.productId.toString(),
        variantId: item.variantId.toString(),
        productModel: item.productModel,
        addedBy: result.product.addedBy.toString(),
        quantity: item.quantity,
        price: result.price,
        details: result.product,
      });
    }

    if (purchasedItems.length === 0) {
      return res.status(400).json({ error: "All items are out of stock" });
    }

    // Create order via order-service internal API
    const orderRes = await fetch(`${ORDER_SERVICE_URL}/internal/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        items: purchasedItems,
        totalAmount,
        status: "Confirmed",
        paymentType: req.body.paymentType || "Online",
        paymentMode: req.body.paymentMode || null,
        orderedDate: new Date(),
      }),
    });

    const order = await orderRes.json();

    cart.items = [];
    await cart.save();

    res.json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addToCart, getCart, updateCartQty, removeFromCart, clearCart, buyAllCartItems };
