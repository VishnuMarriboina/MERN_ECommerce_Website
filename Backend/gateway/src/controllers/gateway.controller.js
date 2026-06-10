const health = (req, res) => {
  res.json({
    status: "API Gateway running",
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      product: process.env.PRODUCT_SERVICE_URL,
      cart: process.env.CART_SERVICE_URL,
      order: process.env.ORDER_SERVICE_URL,
    },
  });
};

module.exports = { health };
