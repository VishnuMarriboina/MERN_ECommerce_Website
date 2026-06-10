const STATUS = require("../constants/statusCodes");

const validate = (validatorFn) => (req, res, next) => {
  const errorMsg = validatorFn(req.body);
  if (errorMsg) {
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message: errorMsg });
  }
  next();
};

module.exports = { validate };
