const mongoose = require("mongoose");
const logger = require("@ecommerce/shared/src/utils/logger");
const { configureDns } = require("@ecommerce/shared/src/utils/configureDns");

configureDns();

const connectDB = async () => {
  const { mongoUri } = require("./env.config");
  try {
    await mongoose.connect(mongoUri);
    logger.info("[auth-service] Connected to MongoDB");
  } catch (err) {
    logger.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
