const addToCartValidator = (body) => {
  const { productId, variantId, productModel } = body;
  if (!productId || !variantId || !productModel) return "productId, variantId, and productModel are required";
  return null;
};

const updateQtyValidator = (body) => {
  const { cartItemId, quantity } = body;
  if (!cartItemId) return "cartItemId is required";
  if (!quantity || quantity < 1) return "quantity must be at least 1";
  return null;
};

module.exports = { addToCartValidator, updateQtyValidator };
