const dotenv = require("dotenv");
dotenv.config();

const requiredEnvVars = ["MDB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
});

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MDB_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};
