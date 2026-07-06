require("./config/env.config");
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db.config");
const cartRoutes = require("./routes/cart.routes");
const internalRoutes = require("./routes/internal/internal.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use("/api/cart", cartRoutes);
app.use("/internal", internalRoutes);
app.get("/health", (req, res) => res.json({ status: "cart-service running" }));

app.use(errorMiddleware);

module.exports = { app, connectDB };
