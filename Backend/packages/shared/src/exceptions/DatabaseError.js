const AppError = require("./AppError");
const STATUS = require("../constants/statusCodes");

class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, STATUS.INTERNAL_SERVER_ERROR);
    this.name = "DatabaseError";
  }
}

module.exports = DatabaseError;
