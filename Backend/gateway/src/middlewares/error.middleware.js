const errorMiddleware = (err, req, res, next) => {
  console.error(`[Gateway Error] ${err.message}`);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Internal server error" });
};

module.exports = errorMiddleware;
