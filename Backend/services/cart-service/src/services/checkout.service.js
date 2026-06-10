const cartRepository = require("../repositories/cart.repository");
const { productServiceUrl, orderServiceUrl } = require("../config/env.config");
const CART_MSGS = require("../constants/cart.messages");
const ORDER_STATUS = require("../constants/orderStatus");

const buyAllCartItems = async (userId, paymentType = "Online", paymentMode = null) => {
  const cart = await cartRepository.findByUserIdRaw(userId);
  if (!cart || cart.items.length === 0) {
    const err = new Error(CART_MSGS.CART_EMPTY); err.status = 400; throw err;
  }

  const purchasedItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const decrementRes = await fetch(`${productServiceUrl}/internal/stock/decrement`, {
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
    const err = new Error(CART_MSGS.OUT_OF_STOCK); err.status = 400; throw err;
  }

  const orderRes = await fetch(`${orderServiceUrl}/internal/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, items: purchasedItems, totalAmount, status: ORDER_STATUS.CONFIRMED, paymentType, paymentMode, orderedDate: new Date() }),
  });

  const order = await orderRes.json();
  cart.items = [];
  await cart.save();

  // Fire-and-forget: increment purchaseCount for each product
  fetch(`${productServiceUrl}/internal/purchase/increment`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(purchasedItems.map((i) => ({ model: i.productModel, productId: i.productId, variantId: i.variantId }))),
  }).catch(() => {});

  return order;
};

module.exports = { buyAllCartItems };
