const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MDB_URI)
  .then(() => console.log("[cart-service] Connected to MongoDB"))
  .catch((err) => console.error("[cart-service] MongoDB connection failed:", err));

app.use(express.json());

app.use("/api/cart", require("./routes/cartRoutes"));

// Internal routes — service-to-service only, not exposed through the gateway
app.use("/internal", require("./routes/internal/internalRoutes"));

app.get("/health", (req, res) => res.json({ status: "cart-service running" }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`[cart-service] Running on http://localhost:${PORT}`);
});

module.exports = app;
