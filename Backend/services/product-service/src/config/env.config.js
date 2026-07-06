const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const { validateEnv } = require("@ecommerce/shared/src/utils/validateEnv");
validateEnv(["MDB_URI", "JWT_SECRET"], "product-service");

module.exports = {
  port: process.env.PORT || 3002,
  mongoUri: process.env.MDB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};
