const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";
const CART_SERVICE = process.env.CART_SERVICE_URL || "http://localhost:3003";
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || "http://localhost:3004";

const proxyOptions = { parseReqBody: false };

app.use("/api/users", proxy(AUTH_SERVICE, proxyOptions));
app.use("/api/clothes", proxy(PRODUCT_SERVICE, proxyOptions));
app.use("/api/accessories", proxy(PRODUCT_SERVICE, proxyOptions));
app.use("/api/footwear", proxy(PRODUCT_SERVICE, proxyOptions));
app.use("/api/cart", proxy(CART_SERVICE, proxyOptions));
app.use("/api/orders", proxy(ORDER_SERVICE, proxyOptions));

app.get("/health", (req, res) =>
  res.json({
    status: "API Gateway running",
    services: { AUTH_SERVICE, PRODUCT_SERVICE, CART_SERVICE, ORDER_SERVICE },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});

module.exports = app;
