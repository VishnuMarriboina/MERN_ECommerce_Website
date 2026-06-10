const AppError = require("../exceptions/AppError");
const errorTypes = require("../exceptions/errorTypes");
const logger = require("../utils/logger");
const STATUS = require("../constants/statusCodes");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err.name === errorTypes.VALIDATION_ERROR) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message: messages.join(", ") });
  }

  if (err.name === errorTypes.TOKEN_EXPIRED_ERROR) {
    return res.status(STATUS.UNAUTHORIZED).json({ success: false, message: "TOKEN_EXPIRED" });
  }

  if (err.name === errorTypes.JWT_ERROR) {
    return res.status(STATUS.FORBIDDEN).json({ success: false, message: "INVALID_TOKEN" });
  }

  return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
};

module.exports = errorMiddleware;
