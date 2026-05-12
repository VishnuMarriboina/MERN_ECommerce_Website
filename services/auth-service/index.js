const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MDB_URI)
  .then(() => console.log("[auth-service] Connected to MongoDB"))
  .catch((err) => console.error("[auth-service] MongoDB connection failed:", err));

app.use(cors({ credentials: true, methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));

app.get("/health", (req, res) => res.json({ status: "auth-service running" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[auth-service] Running on http://localhost:${PORT}`);
});

module.exports = app;
