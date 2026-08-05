const crypto = require("crypto");

const REQUEST_ID_HEADER = "x-request-id";

// Trusts a client-supplied ID (for end-to-end tracing from the frontend) but
// always guarantees one exists, since not all traffic originates there.
const requestIdMiddleware = (req, res, next) => {
  const incomingId = req.headers[REQUEST_ID_HEADER];
  const requestId = incomingId && incomingId.trim() ? incomingId.trim() : crypto.randomUUID();

  req.id = requestId;
  req.headers[REQUEST_ID_HEADER] = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
};

module.exports = { requestIdMiddleware, REQUEST_ID_HEADER };
