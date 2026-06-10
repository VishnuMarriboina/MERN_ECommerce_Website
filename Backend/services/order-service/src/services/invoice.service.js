// Placeholder — generate PDF invoices when needed
const generateInvoice = async (order) => {
  return { orderId: order._id, totalAmount: order.totalAmount, items: order.items };
};

module.exports = { generateInvoice };
