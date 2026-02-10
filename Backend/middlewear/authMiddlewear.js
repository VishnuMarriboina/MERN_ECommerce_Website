const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1 Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "NO_TOKEN" });
    }

    // 2️ Extract token
    const token = authHeader.split(" ")[1];

    // 3️ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️ Attach user to request
    req.user = decoded;

    const userRole = req.user.User_Role?.toLowerCase();
    //  Allow only if role exists in token
    if (!userRole) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "User role missing in token",
      });
    }
    // 5️ Continue
    next(); // this function from the express js
  } catch (err) {
    console.error("Auth error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "TOKEN_EXPIRED" });
    }

    return res.status(403).json({ error: "INVALID_TOKEN" });
  }
};

// ✅ Role-based access control

const authorizeRoles = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "NOT_AUTHENTICATED" });
    }
    const userRole = req.user.User_Role?.toLowerCase();
    //  Allow only if role exists in token
    if (!userRole) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "User role missing in token",
      });
    }

    // if (userRole !== "admin") {
    //   return res.status(403).json({
    //     error: "FORBIDDEN",
    //     message: "Admin role is required",
    //   });
    // }

    // Role exists → allow
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
