// Placeholder — integrate with PDF library (e.g. pdfkit) when needed
const buildInvoiceData = (order) => ({
  invoiceNumber: `INV-${order._id}`,
  date: order.orderedDate,
  items: order.items,
  total: order.totalAmount,
});

module.exports = { buildInvoiceData };
