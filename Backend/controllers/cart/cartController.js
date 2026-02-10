// const Cart = require("../../models/Cart");
// const Order = require("../../models/orders");
// const { Shirts, Tshirts } = require("../../models/Cloths");
// const { Sandles, Shoes } = require("../../models/FootWears");
// const { Belts, Watches } = require("../../models/Accessories");
// const mongoose = require("mongoose");

// const modelRegistry = {
//   shirt: Shirts,
//   tshirt: Tshirts,
//   belt: Belts,
//   shoe: Shoes,
//   sandal: Sandles,
//   watch: Watches,
// };

// const pluralToSingular = {
//   shirts: "shirt",
//   watches: "watch",
//   shoes: "shoe",
//   tshirts: "tshirt",
//   belts: "belt",
//   sandals: "sandal",
// };

// /* =====================================================
//    ADD TO CART (ATOMIC)
// ===================================================== */
// const addToCartold = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { productId, variantId, productModel, quantity = 1 } = req.body;

//     if (!productId || !variantId || !productModel) {
//       return res.status(400).json({
//         error: "productId, variantId, and productModel are required",
//       });
//     }

//     // Normalize model key
//     let modelKey = productModel.trim().toLowerCase();
//     modelKey =
//       pluralToSingular[modelKey] ||
//       (modelKey.endsWith("es")
//         ? modelKey.slice(0, -2)
//         : modelKey.endsWith("s")
//         ? modelKey.slice(0, -1)
//         : modelKey);

//     const Model = modelRegistry[modelKey];
//     if (!Model) {
//       return res.status(400).json({
//         error: `Invalid productModel: ${productModel}`,
//       });
//     }

//     /* =====================================================
//        1️⃣ ATOMIC STOCK CHECK + DECREMENT
//     ===================================================== */
//     const product = await Model.findOneAndUpdate(
//       {
//         _id: productId,
//         "variants._id": variantId,
//         "variants.count": { $gte: quantity }, // 🔒 GUARANTEE STOCK
//       },
//       {
//         $inc: { "variants.$.count": -quantity },
//       },
//       { new: true }
//     );

//     if (!product) {
//       return res.status(400).json({
//         error: "Insufficient stock",
//       });
//     }

//     /* =====================================================
//        2️⃣ ENSURE CART EXISTS
//     ===================================================== */
//     await Cart.updateOne(
//       { userId },
//       { $setOnInsert: { userId, items: [] } },
//       { upsert: true }
//     );

//     /* =====================================================
//        3️⃣ UPDATE CART (SAFE)
//     ===================================================== */
//     const updateResult = await Cart.updateOne(
//       {
//         userId,
//         "items.productId": productId,
//         "items.variantId": variantId,
//       },
//       {
//         $inc: { "items.$.quantity": quantity },
//       }
//     );

//     if (updateResult.matchedCount === 0) {
//       await Cart.updateOne(
//         { userId },
//         {
//           $push: {
//             items: {
//               productId,
//               variantId,
//               productModel: modelKey,
//               quantity,
//             },
//           },
//         }
//       );
//     }

//     /* =====================================================
//        4️⃣ RETURN UPDATED CART
//     ===================================================== */
//     const cart = await Cart.findOne({ userId });

//     return res.status(200).json({
//       message: "Added to cart",
//       cart,
//     });
//   } catch (error) {
//     console.error("Add to cart error:", error);
//     return res.status(500).json({
//       error: "Add to cart failed",
//       details: error.message,
//     });
//   }
// };

// const addToCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { productId, variantId, productModel, quantity = 1 } = req.body;

//     if (!productId || !variantId || !productModel) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     let modelKey = productModel.trim().toLowerCase();
//     modelKey =
//       pluralToSingular[modelKey] ||
//       (modelKey.endsWith("es")
//         ? modelKey.slice(0, -2)
//         : modelKey.endsWith("s")
//         ? modelKey.slice(0, -1)
//         : modelKey);

//     // const Model = modelRegistry[productModel];

//     const Model = modelRegistry[modelKey];
//     if (!Model) {
//       return res.status(400).json({ error: "Invalid product model" });
//     }

//     // 🔍 JUST CHECK stock (DO NOT decrement)
//     const product = await Model.findOne(
//       {
//         _id: productId,
//         "variants._id": variantId,
//         "variants.count": { $gte: quantity },
//       },
//       { "variants.$": 1 }
//     );

//     if (!product) {
//       return res.status(400).json({ error: "Insufficient stock" });
//     }

//     // Ensure cart exists
//     await Cart.updateOne(
//       { userId },
//       { $setOnInsert: { userId, items: [] } },
//       { upsert: true }
//     );

//     // Add or update cart
//     const result = await Cart.updateOne(
//       {
//         userId,
//         "items.productId": productId,
//         "items.variantId": variantId,
//       },
//       {
//         $inc: { "items.$.quantity": quantity },
//       }
//     );

//     if (result.matchedCount === 0) {
//       await Cart.updateOne(
//         { userId },
//         {
//           $push: {
//             items: { productId, variantId, productModel, quantity },
//           },
//         }
//       );
//     }

//     return res.status(200).json({
//       message: "Added to cart",
//       cart: await Cart.findOne({ userId }),
//     });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// /* =====================================================
//    GET CART (READ SAFE)
// ===================================================== */
// const getCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const cart = await Cart.findOne({ userId }).lean();

//     if (!cart) return res.status(200).json({ items: [] });

//     const detailedItems = [];

//     for (const item of cart.items) {
//       const Model = modelRegistry[item.productModel];
//       if (!Model) continue;

//       const product = await Model.findById(item.productId).lean();
//       if (!product) continue;

//       const variant = product.variants.find(
//         (v) => v._id.toString() === item.variantId.toString()
//       );
//       if (!variant) continue;

//       const mergedProductDetails = {
//         ...product,
//         ...variant,
//       };

//       delete mergedProductDetails.variants;

//       detailedItems.push({
//         ...item,
//         productDetails: mergedProductDetails,
//       });
//     }
// console.log("detailedItems", detailedItems);
//     return res.status(200).json({ userId, items: detailedItems });
//   } catch (error) {
//     console.error("Get cart error:", error);
//     res.status(500).json({
//       error: "Failed to fetch cart",
//       details: error.message,
//     });
//   }
// };

// /* =====================================================
//    UPDATE CART QTY (ATOMIC)
// ===================================================== */

// const updateCartQty = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     let { cartItemId, quantity } = req.body;

//     quantity = Number(quantity);

//     if (!cartItemId || isNaN(quantity) || quantity < 1) {
//       return res.status(400).json({
//         error: "cartItemId & valid quantity are required",
//       });
//     }

//     /* =====================================================
//        1️⃣ FETCH CART ITEM (SOURCE OF TRUTH)
//     ===================================================== */
//     const cart = await Cart.findOne(
//       { userId, "items._id": cartItemId },
//       { "items.$": 1 }
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(404).json({ error: "Item not found in cart" });
//     }

//     const item = cart.items[0];
//     const oldQty = item.quantity;
//     const delta = quantity - oldQty;

//     if (delta === 0) {
//       return res.status(200).json({
//         message: "Quantity unchanged",
//         cart: await Cart.findOne({ userId }),
//       });
//     }

//     const variantId = new mongoose.Types.ObjectId(item.variantId);

//     /* =====================================================
//        2️⃣ UPDATE VARIANT STOCK
//     ===================================================== */
//     const Model = modelRegistry[item.productModel];
//     if (!Model) {
//       return res.status(400).json({ error: "Invalid product model" });
//     }

//     // 🔼 Increase qty → reduce stock
//     if (delta > 0) {
//       // const product = await Model.findOneAndUpdate(
//       //   {
//       //     _id: item.productId,
//       //     variants: {
//       //       $elemMatch: {
//       //         _id: variantId,
//       //         count: { $gte: delta },
//       //       },
//       //     },
//       //   },
//       //   {
//       //     $inc: { "variants.$.count": -delta },
//       //   },
//       //   { new: true }
//       // );
//       // Only validate stock, never decrement
//       const product = await Model.findOne(
//         {
//           _id: item.productId,
//           "variants._id": item.variantId,
//           "variants.count": { $gte: quantity },
//         },
//         { "variants.$": 1 }
//       );

//       if (!product) {
//         return res.status(400).json({ error: "Insufficient stock" });
//       }

//       console.log("product", product);

//       if (!product) {
//         return res.status(400).json({
//           error: "Insufficient variant stock",
//         });
//       }
//     }

//     // 🔽 Decrease qty → restore stock
//     if (delta < 0) {
//       await Model.updateOne(
//         {
//           _id: item.productId,
//           "variants._id": variantId,
//         },
//         {
//           $inc: { "variants.$.count": Math.abs(delta) },
//         }
//       );
//     }

//     /* =====================================================
//        3️⃣ UPDATE CART QTY
//     ===================================================== */
//     await Cart.updateOne(
//       { userId, "items._id": cartItemId },
//       { $set: { "items.$.quantity": quantity } }
//     );

//     const updatedCart = await Cart.findOne({ userId });

//     return res.status(200).json({
//       message: "Quantity updated successfully",
//       cart: updatedCart,
//     });
//   } catch (error) {
//     console.error("Update quantity error:", error);
//     return res.status(500).json({
//       error: "Update quantity failed",
//       details: error.message,
//     });
//   }
// };

// /* =====================================================
//    REMOVE FROM CART (ATOMIC)
// ===================================================== */
// const removeFromCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const { productId: cartItemId } = req.body;

//     console.log("req.body", req.body);

//     if (!cartItemId) {
//       return res.status(400).json({ error: "cartItemId required" });
//     }

//     /* =====================================================
//        1️⃣ FETCH CART ITEM
//     ===================================================== */
//     const cart = await Cart.findOne(
//       { userId, "items._id": cartItemId },
//       { "items.$": 1 }
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(404).json({ error: "Item not found in cart" });
//     }

//     const item = cart.items[0];

//     /* =====================================================
//        2️⃣ RESTORE STOCK
//     ===================================================== */
//     const Model = modelRegistry[item.productModel];
//     if (Model) {
//       await Model.updateOne(
//         {
//           _id: item.productId,
//           "variants._id": item.variantId,
//         },
//         {
//           $inc: { "variants.$.count": item.quantity },
//         }
//       );
//     }

//     /* =====================================================
//        3️⃣ REMOVE ITEM FROM CART
//     ===================================================== */
//     await Cart.updateOne({ userId }, { $pull: { items: { _id: cartItemId } } });

//     return res.status(200).json({ message: "Item removed from cart" });
//   } catch (error) {
//     console.error("Remove item error:", error);
//     res.status(500).json({
//       error: "Remove item failed",
//       details: error.message,
//     });
//   }
// };

// /* =====================================================
//    CLEAR CART (ATOMIC)
// ===================================================== */
// const clearCart = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     /* =====================================================
//        1️⃣ FETCH CART
//     ===================================================== */
//     const cart = await Cart.findOne({ userId });

//     if (!cart || cart.items.length === 0) {
//       return res.status(200).json({ message: "Cart already empty", cart });
//     }

//     /* =====================================================
//        2️⃣ RESTORE STOCK FOR ALL ITEMS
//     ===================================================== */
//     for (const item of cart.items) {
//       const Model = modelRegistry[item.productModel];
//       if (!Model) continue;

//       await Model.updateOne(
//         {
//           _id: item.productId,
//           "variants._id": item.variantId,
//         },
//         {
//           $inc: { "variants.$.count": item.quantity },
//         }
//       );
//     }

//     /* =====================================================
//        3️⃣ CLEAR CART
//     ===================================================== */
//     cart.items = [];
//     await cart.save();

//     return res.status(200).json({
//       message: "Cart cleared successfully",
//       cart,
//     });
//   } catch (error) {
//     console.error("Clear cart error:", error);
//     res.status(500).json({
//       error: "Clear cart failed",
//       details: error.message,
//     });
//   }
// };

// /* =====================================================
//    BUY ALL CART ITEMS (TRANSACTION)
// ===================================================== */

// const buyAllCartItems = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const cart = await Cart.findOne({ userId });

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ error: "Cart is empty" });
//     }

//     let { paymentType, paymentMode } = req.body;

//     if (!paymentType) paymentType = "Online";
//     if (paymentType === "COD") paymentMode = null;

//     const validTypes = ["COD", "Online"];
//     if (!validTypes.includes(paymentType)) {
//       return res.status(400).json({ error: "Invalid payment type" });
//     }

//     const validModes = ["UPI", "NetBanking", "CreditCard"];
//     if (paymentType === "Online" && !validModes.includes(paymentMode)) {
//       return res.status(400).json({
//         error: `Invalid payment mode. Choose: ${validModes.join(", ")}`,
//       });
//     }

//     const results = {};
//     const remainingItems = [];
//     const purchasedItems = [];
//     let totalAmount = 0;

//     for (const item of cart.items) {
//       const { productId, variantId, productModel, quantity } = item;

//       const Model = modelRegistry[productModel];
//       if (!Model) {
//         results[productModel] = { success: false, message: "Invalid model" };
//         remainingItems.push(item);
//         continue;
//       }

//       // 🔒 ATOMIC stock deduction
//       const product = await Model.findOneAndUpdate(
//         {
//           _id: productId,
//           "variants._id": variantId,
//           "variants.count": { $gte: quantity },
//         },
//         {
//           $inc: { "variants.$.count": -quantity },
//         },
//         { new: true }
//       );

//       if (!product) {
//         results[productModel] = {
//           success: false,
//           message: "Insufficient stock",
//         };
//         remainingItems.push(item);
//         continue;
//       }

//       const variant = product.variants.id(variantId);

//       const itemTotal = variant.cost * quantity;
//       totalAmount += itemTotal;

//       const mergedDetails = {
//         ...product.toObject(),
//         ...variant.toObject(),
//       };
//       delete mergedDetails.variants;
//       delete mergedDetails.__v;

//       purchasedItems.push({
//         productId,
//         variantId,
//         addedBy: product.addedBy,
//         productModel,
//         quantity,
//         price: variant.cost,
//         details: mergedDetails,
//       });

//       results[productModel] = {
//         success: true,
//         message: "Variant purchased successfully",
//       };
//     }

//     let order = null;

//     if (purchasedItems.length > 0) {
//       order = await Order.create({
//         userId,
//         items: purchasedItems,
//         totalAmount,
//         paymentType,
//         paymentMode: paymentType === "COD" ? null : paymentMode,
//         status: "Confirmed",
//         orderedDate: new Date(),
//         history: [
//           {
//             from: "Placed",
//             to: "Confirmed",
//             changedAt: new Date(),
//           },
//         ],
//       });
//     }

//     // 🧹 Keep failed items in cart
//     cart.items = remainingItems;
//     await cart.save();

//     return res.status(200).json({
//       message: "Purchase processed successfully",
//       results,
//       order,
//       remainingItems,
//     });
//   } catch (error) {
//     console.error("Purchase Error:", error);
//     res.status(500).json({
//       error: "Failed to purchase all items",
//       details: error.message,
//     });
//   }
// };

// module.exports = {
//   addToCart,
//   getCart,
//   updateCartQty,
//   removeFromCart,
//   clearCart,
//   buyAllCartItems,
// };
///////////////////////////////////////////////////////////////////new code

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
