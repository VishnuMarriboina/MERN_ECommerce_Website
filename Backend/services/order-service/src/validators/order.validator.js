const { VALID_STATUSES } = require("../constants/orderStatus");

const updateStatusValidator = (body) => {
  const { status } = body;
  if (!status) return "status is required";
  if (!VALID_STATUSES.includes(status)) return `status must be one of: ${VALID_STATUSES.join(", ")}`;
  return null;
};

module.exports = { updateStatusValidator };
