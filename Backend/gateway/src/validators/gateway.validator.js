// Gateway-level request validators (e.g., checking required headers)
const requireAuthHeader = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, message: "Authorization header required" });
  }
  next();
};

module.exports = { requireAuthHeader };
