require("./config/env.config");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const profileRoutes = require("./routes/profile.routes");
const contactRoutes = require("./routes/contact.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/contact", contactRoutes);
app.get("/health", (req, res) => res.json({ status: "auth-service running" }));

app.use(errorMiddleware);

module.exports = { app, connectDB };
