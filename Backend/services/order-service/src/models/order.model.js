const mongoose = require("mongoose");
const ORDER_STATUS = require("../constants/orderStatus");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    items: [{
      productId: { type: String, required: true },
      variantId: { type: String, required: true },
      productModel: { type: String, required: true },
      addedBy: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      details: { type: Object, required: true },
    }],
    totalAmount: { type: Number, required: true },
    paymentType: { type: String, enum: ["COD", "Online"], required: true, default: "Online" },
    paymentMode: { type: String, enum: ["UPI", "NetBanking", "CreditCard", null], default: null },
    status: { type: String, enum: ORDER_STATUS.VALID_STATUSES, default: ORDER_STATUS.PENDING },
    history: [{ from: String, to: String, changedAt: Date }],
    orderedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
