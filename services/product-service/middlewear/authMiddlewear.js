const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "NO_TOKEN" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const userRole = req.user.User_Role?.toLowerCase();
    if (!userRole) {
      return res.status(403).json({ error: "FORBIDDEN", message: "User role missing in token" });
    }
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "TOKEN_EXPIRED" });
    }
    return res.status(403).json({ error: "INVALID_TOKEN" });
  }
};

const authorizeRoles = () => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "NOT_AUTHENTICATED" });
    const userRole = req.user.User_Role?.toLowerCase();
    if (!userRole) {
      return res.status(403).json({ error: "FORBIDDEN", message: "User role missing in token" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
