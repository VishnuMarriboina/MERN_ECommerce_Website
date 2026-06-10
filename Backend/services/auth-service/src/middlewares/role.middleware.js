const STATUS = require("@ecommerce/shared/src/constants/statusCodes");
const MESSAGES = require("../constants/auth.messages");

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(STATUS.UNAUTHORIZED).json({ error: MESSAGES.AUTH.NOT_AUTHENTICATED });
  const userRole = req.user.User_Role?.toLowerCase();
  if (!roles.map((r) => r.toLowerCase()).includes(userRole)) {
    return res.status(STATUS.FORBIDDEN).json({ error: MESSAGES.AUTH.FORBIDDEN });
  }
  next();
};

module.exports = { requireRole };
