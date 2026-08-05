require("./config/env.config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { allowedOrigins } = require("./config/env.config");
const rateLimiter = require("./middlewares/rateLimiter.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const { requestIdMiddleware } = require("./middlewares/requestId.middleware");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const { health } = require("./controllers/gateway.controller");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  exposedHeaders: ["X-Request-ID"],
}));

app.use(requestIdMiddleware);

app.use(rateLimiter);

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

app.get("/health", health);

app.use(errorMiddleware);

module.exports = app;
