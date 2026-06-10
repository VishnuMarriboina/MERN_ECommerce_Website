module.exports = {
  constants: {
    STATUS: require("./constants/statusCodes"),
    ROLES: require("./constants/roles"),
    MESSAGES: require("./constants/messages"),
  },
  exceptions: {
    AppError: require("./exceptions/AppError"),
    DatabaseError: require("./exceptions/DatabaseError"),
    ValidationError: require("./exceptions/ValidationError"),
    errorTypes: require("./exceptions/errorTypes"),
  },
  middlewares: {
    auth: require("./middlewares/auth.middleware"),
    error: require("./middlewares/error.middleware"),
    logger: require("./middlewares/logger.middleware"),
    validation: require("./middlewares/validation.middleware"),
  },
  utils: {
    asyncHandler: require("./utils/asyncHandler"),
    logger: require("./utils/logger"),
    pagination: require("./utils/pagination"),
    responseHandler: require("./utils/responseHandler"),
  },
  validators: {
    common: require("./validators/common.validator"),
  },
};
