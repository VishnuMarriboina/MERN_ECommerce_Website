const logger = require("@ecommerce/shared/src/utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(`[Gateway Error] ${err.message}`);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Internal server error" });
};

module.exports = errorMiddleware;
