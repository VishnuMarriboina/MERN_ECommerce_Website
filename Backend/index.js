const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const shirtsRoutes = require("./routes/clothes/shirtsRoutes");
const tshirtsRoutes = require("./routes/clothes/tshirtsRoutes");
const beltsRoutes = require("./routes/accessories/beltsRoutes");
const watchesRoutes = require("./routes/accessories/watchesRoutes");
const shoesRoutes = require("./routes/footwear/shoesRoutes");
const sandalsRoutes = require("./routes/footwear/sandalsRoutes");
const usersRoutes = require("./routes/userRoutes/userRoutes");
dotenv.config();

// to connect mongoDB compass
mongoose
  .connect(process.env.MDB_URI)
  .then(() => {
    console.log("Connected to MongoDB Compass Successfully");
  })
  .catch((err) => {
    console.log("Failed to connect MongoDB Compass", err);
  });

// app.use(cors());
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
app.use(cookieParser());

app.use(express.json());

app.use("/api/clothes", shirtsRoutes);
app.use("/api/clothes", tshirtsRoutes);
app.use("/api/accessories", beltsRoutes);
app.use("/api/accessories", watchesRoutes);
app.use("/api/footwear", shoesRoutes);
app.use("/api/footwear", sandalsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cart", require("./routes/cart/cartRoutes"));
app.use("/api/orders", require("./routes/orders/ordersRoutes"));

app.listen(5500, () => {
  console.log("Server is running  http://localhost:5500");
});

module.exports = app;
