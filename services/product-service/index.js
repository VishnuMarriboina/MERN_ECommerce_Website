const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MDB_URI)
  .then(() => console.log("[product-service] Connected to MongoDB"))
  .catch((err) => console.error("[product-service] MongoDB connection failed:", err));

app.use(express.json());

app.use("/api/clothes", require("./routes/clothes/shirtsRoutes"));
app.use("/api/clothes", require("./routes/clothes/tshirtsRoutes"));
app.use("/api/accessories", require("./routes/accessories/beltsRoutes"));
app.use("/api/accessories", require("./routes/accessories/watchesRoutes"));
app.use("/api/footwear", require("./routes/footwear/shoesRoutes"));
app.use("/api/footwear", require("./routes/footwear/sandalsRoutes"));

// Internal routes — service-to-service only, not exposed through the gateway
app.use("/internal", require("./routes/internal/internalRoutes"));

app.get("/health", (req, res) => res.json({ status: "product-service running" }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`[product-service] Running on http://localhost:${PORT}`);
});

module.exports = app;
