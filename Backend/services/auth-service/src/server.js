const { app, connectDB } = require("./app");
const { port } = require("./config/env.config");
const logger = require("@ecommerce/shared/src/utils/logger");
const mongoose = require("mongoose");
const { setupGracefulShutdown } = require("@ecommerce/shared/src/utils/gracefulShutdown");

const start = async () => {
  await connectDB();
  const server = app.listen(port, () => logger.info(`[auth-service] Running on http://localhost:${port}`));
  setupGracefulShutdown({ serviceName: "auth-service", server, mongoose });
};

start();
