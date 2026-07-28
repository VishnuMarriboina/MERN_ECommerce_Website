const cartRepository = require("../repositories/cart.repository");
const { productServiceUrl, orderServiceUrl } = require("../config/env.config");
const CART_MSGS = require("../constants/cart.messages");
const ORDER_STATUS = require("../constants/orderStatus");
const { fetchWithTimeout } = require("@ecommerce/shared/src/utils/httpClient");
const logger = require("@ecommerce/shared/src/utils/logger");

// Compensating action when stock was decremented but the order could not be created.
// Best-effort: if this also fails, the discrepancy is logged for manual reconciliation.
const restoreStock = async (items) => {
  try {
    await fetchWithTimeout(`${productServiceUrl}/internal/stock/restore`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }))),
    });
  } catch (err) {
    logger.error(`Stock restore failed after order-create failure: ${err.message} items=${JSON.stringify(items)}`);
  }
};

const buyAllCartItems = async (userId, paymentType = "Online", paymentMode = null) => {
  const cart = await cartRepository.findByUserIdRaw(userId);
  if (!cart || cart.items.length === 0) {
    const err = new Error(CART_MSGS.CART_EMPTY); err.status = 400; throw err;
  }

  const purchasedItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    let result;
    try {
      const decrementRes = await fetchWithTimeout(`${productServiceUrl}/internal/stock/decrement`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: item.productModel,
          productId: item.productId.toString(),
          variantId: item.variantId.toString(),
          quantity: item.quantity,
        }),
      });
      if (!decrementRes.ok) continue;
      result = await decrementRes.json();
    } catch (err) {
      continue; // product-service unreachable/timed out — treat this item as unavailable
    }
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

  let order;
  try {
    const orderRes = await fetchWithTimeout(`${orderServiceUrl}/internal/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, items: purchasedItems, totalAmount, status: ORDER_STATUS.CONFIRMED, paymentType, paymentMode, orderedDate: new Date() }),
    });
    if (!orderRes.ok) throw new Error(CART_MSGS.ORDER_CREATE_FAILED);
    order = await orderRes.json();
  } catch (err) {
    await restoreStock(purchasedItems);
    const failure = new Error(CART_MSGS.ORDER_CREATE_FAILED);
    failure.status = 502;
    throw failure;
  }

  // Cart is only cleared once the order is confirmed created — a failed order above
  // leaves the cart untouched so the user can retry checkout.
  cart.items = [];
  await cart.save();

  // Fire-and-forget: increment purchaseCount for each product
  fetchWithTimeout(`${productServiceUrl}/internal/purchase/increment`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(purchasedItems.map((i) => ({ model: i.productModel, productId: i.productId, variantId: i.variantId }))),
  }).catch(() => {});

  return order;
};

module.exports = { buyAllCartItems };
