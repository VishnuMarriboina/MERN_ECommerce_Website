const { verifyAccessToken } = require("../utils/token.util");
const MESSAGES = require("../constants/auth.messages");
const STATUS = require("@ecommerce/shared/src/constants/statusCodes");

class AuthMiddleware {
  authenticate = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(STATUS.UNAUTHORIZED).json({ error: MESSAGES.AUTH.NO_AUTH_TOKEN });
      }
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      if (!req.user.User_Role) {
        return res.status(STATUS.FORBIDDEN).json({ error: MESSAGES.AUTH.FORBIDDEN, message: MESSAGES.AUTH.ROLE_MISSING });
      }
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(STATUS.UNAUTHORIZED).json({ error: MESSAGES.AUTH.TOKEN_EXPIRED });
      }
      return res.status(STATUS.FORBIDDEN).json({ error: MESSAGES.AUTH.INVALID_TOKEN });
    }
  };
}

module.exports = new AuthMiddleware();
