const logger = require("./logger");

const SHUTDOWN_TIMEOUT_MS = 10000;

// Wires up SIGTERM/SIGINT (orchestrator restarts/deploys) and
// uncaughtException/unhandledRejection (programmer errors) to a single
// shutdown path: stop accepting new connections, close the DB, then exit —
// instead of the process hanging on restart or dying mid-request with no log.
const setupGracefulShutdown = ({ serviceName, server, mongoose }) => {
  let shuttingDown = false;

  const shutdown = (exitCode, reason) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`[${serviceName}] Shutting down (${reason})`);

    const forceExit = setTimeout(() => {
      logger.error(`[${serviceName}] Forced exit after ${SHUTDOWN_TIMEOUT_MS}ms shutdown timeout`);
      process.exit(exitCode);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    Promise.resolve()
      .then(() => server && new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }))
      .then(() => mongoose && mongoose.connection.readyState !== 0 && mongoose.connection.close())
      .catch((err) => logger.error(`[${serviceName}] Error during shutdown: ${err.message}`))
      .finally(() => {
        clearTimeout(forceExit);
        process.exit(exitCode);
      });
  };

  process.on("SIGTERM", () => shutdown(0, "SIGTERM"));
  process.on("SIGINT", () => shutdown(0, "SIGINT"));
  process.on("unhandledRejection", (reason) => {
    logger.error(`[${serviceName}] Unhandled rejection: ${reason?.stack || reason}`);
    shutdown(1, "unhandledRejection");
  });
  process.on("uncaughtException", (err) => {
    logger.error(`[${serviceName}] Uncaught exception: ${err.stack || err.message}`);
    shutdown(1, "uncaughtException");
  });
};

module.exports = { setupGracefulShutdown };
