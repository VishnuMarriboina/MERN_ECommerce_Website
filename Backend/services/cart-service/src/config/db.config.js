const mongoose = require("mongoose");
const logger = require("@ecommerce/shared/src/utils/logger");
const { configureDns } = require("@ecommerce/shared/src/utils/configureDns");

configureDns();

const connectDB = async () => {
  const { mongoUri } = require("./env.config");
  try {
    await mongoose.connect(mongoUri);
    logger.info("[cart-service] Connected to MongoDB");
  } catch (err) {
    logger.error("[cart-service] MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
