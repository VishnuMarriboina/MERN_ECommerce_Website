const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const { validateEnv } = require("@ecommerce/shared/src/utils/validateEnv");
const { buildMongoUri } = require("@ecommerce/shared/src/utils/buildMongoUri");
validateEnv(["DB_USERNAME", "DB_PASSWORD", "MDB_HOST", "MDB_DBNAME", "JWT_SECRET"], "cart-service");

module.exports = {
  port: process.env.PORT || 3003,
  mongoUri: buildMongoUri({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.MDB_HOST,
    dbName: process.env.MDB_DBNAME,
  }),
  nodeEnv: process.env.NODE_ENV || "development",
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3004",
};
