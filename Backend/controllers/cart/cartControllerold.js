const Cart = require("../../models/Cart");
// const User = require("../../models/users");
const Order = require("../../models/orders");
const { Shirts, Tshirts } = require("../../models/Cloths");
const { Sandles, Shoes } = require("../../models/FootWears");
const { Belts, Watches } = require("../../models/Accessories");

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

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, variantId, productModel, quantity } = req.body;

    if (!productId || !variantId || !productModel) {
      return res.status(400).json({
        error: "productId, variantId, and productModel are required",
      });
    }

    let modelKey = productModel.trim().toLowerCase();

    // Convert plural to singular if exists
    if (pluralToSingular[modelKey]) {
      modelKey = pluralToSingular[modelKey];
    } else {
      if (modelKey.endsWith("es")) modelKey = modelKey.slice(0, -2);
      else if (modelKey.endsWith("s")) modelKey = modelKey.slice(0, -1);
    }

    if (!modelRegistry[modelKey]) {
      return res.status(400).json({
        error: `Invalid productModel: ${productModel}`,
      });
    }

    // Find the product and verify variant exists
    const Model = modelRegistry[modelKey];
    const product = await Model.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the specific variant
    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Check stock availability
    if (variant.count < 1) {
      return res.status(400).json({ error: "Variant out of stock" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    // Check if this exact product + variant combination exists in cart
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId &&
        item.productModel === modelKey
    );

    if (existingItem) {
      // Check if adding more would exceed stock
      const newQuantity = existingItem.quantity + (Number(quantity) || 1);
      if (newQuantity > variant.count) {
        return res.status(400).json({
          error: `Only ${variant.count} available in stock`,
          availableStock: variant.count,
          currentInCart: existingItem.quantity,
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId,
        variantId,
        productModel: modelKey,
        quantity: Number(quantity) || 1,
      });
    }

    await cart.save();
    return res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      error: "Add to cart failed",
      details: error.message,
    });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    // console.log("438 triggred.........!!!!");
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(200).json({ items: [] });

    const detailedItems = [];

    for (const item of cart.items) {
      let modelKey = item.productModel.trim().toLowerCase();
      modelKey = modelKey.endsWith("s") ? modelKey.slice(0, -1) : modelKey;

      const Model = modelRegistry[modelKey];
      if (!Model) continue;

      const product = await Model.findById(item.productId);
      if (!product) continue;

      // Find selected variant
      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );
      if (!variant) continue;

      // ✅ Merge product + variant into ONE object
      const mergedProductDetails = {
        ...product.toObject(),
        ...variant.toObject(),
      };

      // Remove the variants array since not needed
      delete mergedProductDetails.variants;

      detailedItems.push({
        ...item._doc,
        productDetails: mergedProductDetails, // merged output
      });
    }
    // console.log("detailedItems", detailedItems);
    return res.status(200).json({ userId, items: detailedItems });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      error: "Failed to fetch cart",
      details: error.message,
    });
  }
};

// UPDATE QUANTITY
const updateCartQty = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity == null) {
      return res.status(400).json({
        error: "cartItemId & quantity are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(cartItemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Verify stock availability for the variant
    const modelKey = item.productModel.toLowerCase();
    const Model = modelRegistry[modelKey];
    const product = await Model.findById(item.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variant = product.variants.find(
      (v) => v._id.toString() === item.variantId.toString()
    );

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    if (Number(quantity) > variant.count) {
      return res.status(400).json({
        error: `Only ${variant.count} available in stock`,
        availableStock: variant.count,
      });
    }

    item.quantity = Number(quantity);
    await cart.save();

    return res.status(200).json({
      message: "Quantity updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    return res.status(500).json({
      error: "Update quantity failed",
      details: error.message,
    });
  }
};

// REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({
      error: "Remove item failed",
      details: error.message,
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      error: "Clear cart failed",
      details: error.message,
    });
  }
};

// BUY ALL CART ITEMS

const buyAllCartItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // console.log("req.body in the order creation:", req.body);

    let { paymentType, paymentMode } = req.body;

    if (!paymentType) paymentType = "Online";
    if (paymentType === "COD") paymentMode = null;

    const validTypes = ["COD", "Online"];
    if (!validTypes.includes(paymentType)) {
      return res.status(400).json({ error: "Invalid payment type" });
    }

    const validModes = ["UPI", "NetBanking", "CreditCard"];
    if (paymentType === "Online" && !validModes.includes(paymentMode)) {
      return res.status(400).json({
        error: `Invalid payment mode. Choose: ${validModes.join(", ")}`,
      });
    }

    const results = {};
    const remainingItems = [];
    const purchasedItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const { productId, variantId, productModel, quantity } = item;

      let modelKey = productModel.toLowerCase();
      const Model = modelRegistry[modelKey];
      if (!Model) {
        results[productModel] = { success: false, message: "Invalid model" };
        remainingItems.push(item);
        continue;
      }

      const product = await Model.findById(productId);
      if (!product) {
        results[productModel] = {
          success: false,
          message: "Product not found",
        };
        remainingItems.push(item);
        continue;
      }

      // Get variant
      const variant = product.variants.find(
        (v) => v._id.toString() === variantId.toString()
      );

      if (!variant) {
        results[productModel] = {
          success: false,
          message: "Variant not found",
        };
        remainingItems.push(item);
        continue;
      }

      // Check stock
      if (variant.count < quantity) {
        results[productModel] = {
          success: false,
          message: `Only ${variant.count} left`,
        };
        remainingItems.push(item);
        continue;
      }

      // Deduct stock
      variant.count -= quantity;
      await product.save();

      const itemTotal = variant.cost * quantity;
      totalAmount += itemTotal;

      const mergedDetails = {
        ...product.toObject(),
        ...variant.toObject(),
      };
      // console.log("mergedDetails123123242145:", mergedDetails);
      delete mergedDetails.variants;
      delete mergedDetails.__v;

      purchasedItems.push({
        productId,
        variantId,
        addedBy: product.addedBy,
        productModel: modelKey,
        quantity,
        price: variant.cost,
        details: mergedDetails,
      });

      results[productModel] = {
        success: true,
        message: "Variant purchased successfully",
      };
    }
    // console.log("purchasedItems in 690:", purchasedItems);
    let order = null;

    if (purchasedItems.length > 0) {
      order = await Order.create({
        userId,
        items: purchasedItems,
        totalAmount,
        paymentType,
        paymentMode: paymentType === "COD" ? null : paymentMode,
        status: "Confirmed",
        orderedDate: new Date(),
        history: [
          {
            from: "Placed",
            to: "Confirmed",
            changedAt: new Date(),
          },
        ],
      });
    }

    // console.log("order in 700==============================:", order);
    // Keep failed items in cart
    cart.items = remainingItems;
    await cart.save();

    return res.status(200).json({
      message: "Purchase processed successfully",
      results,
      order,
      remainingItems,
    });
  } catch (error) {
    console.error("Purchase Error:", error);
    res.status(500).json({
      error: "Failed to purchase all items",
      details: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  buyAllCartItems,
};
