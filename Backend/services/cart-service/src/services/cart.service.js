const cartRepository = require("../repositories/cart.repository");
const { productServiceUrl } = require("../config/env.config");
const CART_MSGS = require("../constants/cart.messages");
const { fetchWithTimeout } = require("@ecommerce/shared/src/utils/httpClient");

const pluralToSingular = {
  shirts: "shirt",
  watches: "watch",
  shoes: "shoe",
  tshirts: "tshirt",
  belts: "belt",
  sandals: "sandal",
};

const normalizeModel = (model) => {
  const key = model.trim().toLowerCase();
  return (
    pluralToSingular[key] ||
    (key.endsWith("es")
      ? key.slice(0, -2)
      : key.endsWith("s")
        ? key.slice(0, -1)
        : key)
  );
};

const getVariantStock = async (model, productId, variantId) => {
  const res = await fetchWithTimeout(
    `${productServiceUrl}/internal/stock/${model}/${productId}/${variantId}`,
  );
  const data = await res.json();
  return data.count ?? 0;
};

const addToCart = async (
  userId,
  productId,
  variantId,
  productModel,
  quantity = 1,
) => {
  const modelKey = normalizeModel(productModel);
  if (!modelKey) {
    const err = new Error(CART_MSGS.INVALID_MODEL);
    err.status = 400;
    throw err;
  }

  const stock = await getVariantStock(modelKey, productId, variantId);
  const existing = await cartRepository.findItemInCart(
    userId,
    productId,
    variantId,
  );
  const alreadyInCart = existing?.items?.[0]?.quantity ?? 0;

  if (alreadyInCart + quantity > stock) {
    const err = new Error(`Only ${stock} items available`);
    err.status = 400;
    throw err;
  }

  await cartRepository.upsertCart(userId);
  const result = await cartRepository.incrementItemQty(
    userId,
    productId,
    variantId,
    quantity,
  );
  if (result.matchedCount === 0) {
    await cartRepository.pushItem(userId, {
      productId,
      variantId,
      productModel: modelKey,
      quantity,
    });
  }
  return cartRepository.findByUserId(userId);
};

const getCart = async (userId) => {
  const cart = await cartRepository.findByUserId(userId);
  if (!cart) return { items: [] };

  const items = [];
  for (const item of cart.items) {
    const productRes = await fetchWithTimeout(
      `${productServiceUrl}/internal/products/${item.productModel}/${item.productId}`,
    );
    if (!productRes.ok) continue;
    const product = await productRes.json();
    const variant = product.variants?.find(
      (v) => v._id.toString() === item.variantId.toString(),
    );
    if (!variant) continue;
    items.push({
      ...item,
      productDetails: { ...product, ...variant, variants: undefined },
    });
  }
  return { userId, items };
};

const updateCartQty = async (userId, cartItemId, quantity) => {
  if (!cartItemId || quantity < 1) {
    const err = new Error(CART_MSGS.INVALID_INPUT);
    err.status = 400;
    throw err;
  }
  const cart = await cartRepository.findItemById(userId, cartItemId);
  if (!cart) {
    const err = new Error(CART_MSGS.ITEM_NOT_FOUND);
    err.status = 404;
    throw err;
  }

  const item = cart.items[0];
  const stock = await getVariantStock(
    item.productModel,
    item.productId,
    item.variantId,
  );
  if (quantity > stock) {
    const err = new Error(`Only ${stock} items available`);
    err.status = 400;
    throw err;
  }

  await cartRepository.setItemQty(userId, cartItemId, quantity);
  return cartRepository.findByUserId(userId);
};

const removeFromCart = (userId, cartItemId) =>
  cartRepository.removeItem(userId, cartItemId);
const clearCart = (userId) => cartRepository.clearItems(userId);

module.exports = {
  addToCart,
  getCart,
  updateCartQty,
  removeFromCart,
  clearCart,
};
