require("./config/env.config");
const express = require("express");
const connectDB = require("./config/db.config");
const orderRoutes = require("./routes/order.routes");
const internalRoutes = require("./routes/internal/internal.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/internal", internalRoutes);
app.get("/health", (req, res) => res.json({ status: "order-service running" }));

app.use(errorMiddleware);

module.exports = { app, connectDB };
