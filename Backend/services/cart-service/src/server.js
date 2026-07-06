const { app, connectDB } = require("./app");
const { port } = require("./config/env.config");
const mongoose = require("mongoose");
const logger = require("@ecommerce/shared/src/utils/logger");
const { setupGracefulShutdown } = require("@ecommerce/shared/src/utils/gracefulShutdown");

const start = async () => {
  await connectDB();
  const server = app.listen(port, () => logger.info(`[cart-service] Running on http://localhost:${port}`));
  setupGracefulShutdown({ serviceName: "cart-service", server, mongoose });
};

start();
