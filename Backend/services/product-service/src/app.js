require("./config/env.config");
const express = require("express");
const connectDB = require("./config/db.config");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(express.json());

app.use("/internal", require("./routes/internal/internal.routes"));
app.use("/api/products", require("./routes/rating.routes"));
app.use("/api/products", require("./routes/generic/generic.routes"));

app.get("/health", (req, res) => res.json({ status: "product-service running" }));

app.use(errorMiddleware);

module.exports = { app, connectDB };
