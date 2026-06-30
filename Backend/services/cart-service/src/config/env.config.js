const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

module.exports = {
  port: process.env.PORT || 3003,
  mongoUri: process.env.MDB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3004",
};
