require("./config/env.config");
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db.config");
const orderRoutes = require("./routes/order.routes");
const internalRoutes = require("./routes/internal/internal.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(helmet());
// Higher than other services: order creation embeds a full product snapshot
// per cart item (see cart-service checkout.service.js purchasedItems).
app.use(express.json({ limit: "1mb" }));

app.use("/api/orders", orderRoutes);
app.use("/internal", internalRoutes);
app.get("/health", (req, res) => res.json({ status: "order-service running" }));

app.use(errorMiddleware);

module.exports = { app, connectDB };
