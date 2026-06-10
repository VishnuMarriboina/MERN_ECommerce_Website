const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  port: process.env.PORT || 3004,
  mongoUri: process.env.MDB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};
