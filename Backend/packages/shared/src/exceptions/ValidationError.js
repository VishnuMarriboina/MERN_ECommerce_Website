const AppError = require("./AppError");
const STATUS = require("../constants/statusCodes");

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, STATUS.BAD_REQUEST);
    this.name = "ValidationError";
  }
}

module.exports = ValidationError;
