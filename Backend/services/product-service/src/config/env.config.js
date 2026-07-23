const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const { validateEnv } = require("@ecommerce/shared/src/utils/validateEnv");
const { buildMongoUri } = require("@ecommerce/shared/src/utils/buildMongoUri");
validateEnv(["DB_USERNAME", "DB_PASSWORD", "MDB_HOST", "MDB_DBNAME", "JWT_SECRET"], "product-service");

module.exports = {
  port: process.env.PORT || 3002,
  mongoUri: buildMongoUri({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.MDB_HOST,
    dbName: process.env.MDB_DBNAME,
  }),
  nodeEnv: process.env.NODE_ENV || "development",
};
