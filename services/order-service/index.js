const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MDB_URI)
  .then(() => console.log("[order-service] Connected to MongoDB"))
  .catch((err) => console.error("[order-service] MongoDB connection failed:", err));

app.use(express.json());

app.use("/api/orders", require("./routes/ordersRoutes"));

// Internal routes — service-to-service only, not exposed through the gateway
app.use("/internal", require("./routes/internal/internalRoutes"));

app.get("/health", (req, res) => res.json({ status: "order-service running" }));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`[order-service] Running on http://localhost:${PORT}`);
});

module.exports = app;
