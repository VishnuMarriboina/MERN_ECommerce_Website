const mongoose = require("mongoose");

const connectDB = async () => {
  const { mongoUri } = require("./env.config");
  await mongoose.connect(mongoUri);
  console.log("[cart-service] Connected to MongoDB");
};

module.exports = connectDB;
