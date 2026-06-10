const { app, connectDB } = require("./app");
const { port } = require("./config/env.config");
const logger = require("@ecommerce/shared/src/utils/logger");

const start = async () => {
  await connectDB();
  app.listen(port, () => logger.info(`[auth-service] Running on http://localhost:${port}`));
};

start();
