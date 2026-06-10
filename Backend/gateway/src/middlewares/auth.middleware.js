// Gateway-level auth check (lightweight — just verifies token format before proxying)
const authCheck = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "NO_TOKEN" });
  }
  next();
};

module.exports = { authCheck };
