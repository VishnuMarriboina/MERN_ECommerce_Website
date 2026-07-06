require("./config/env.config");
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db.config");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(helmet());
// Higher than auth/cart: product create/update payloads can include many variants.
app.use(express.json({ limit: "1mb" }));

app.use("/internal", require("./routes/internal/internal.routes"));
app.use("/api/products", require("./routes/rating.routes"));
app.use("/api/products", require("./routes/generic/generic.routes"));

app.get("/health", (req, res) => res.json({ status: "product-service running" }));

app.use(errorMiddleware);

module.exports = { app, connectDB };
