const app = require("./app");
const { port } = require("./config/env.config");
const logger = require("@ecommerce/shared/src/utils/logger");
const { setupGracefulShutdown } = require("@ecommerce/shared/src/utils/gracefulShutdown");

const server = app.listen(port, () => {
  logger.info(`[gateway] Running on http://localhost:${port}`);
});

setupGracefulShutdown({ serviceName: "gateway", server });
