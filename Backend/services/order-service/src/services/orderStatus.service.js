const ORDER_STATUS = require("../constants/orderStatus");

const isValidTransition = (from, to) => {
  const transitions = {
    [ORDER_STATUS.PENDING]:   [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.SHIPPED]:   [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  };
  return transitions[from]?.includes(to) ?? false;
};

const isValidStatus = (status) => ORDER_STATUS.VALID_STATUSES.includes(status);

module.exports = { isValidTransition, isValidStatus };
