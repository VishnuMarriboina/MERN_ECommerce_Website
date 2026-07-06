// Fails fast at startup with a clear message listing every missing var,
// instead of the service booting normally and only breaking later at the
// first request/query that happens to touch the missing config.
const validateEnv = (requiredKeys, serviceName) => {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[${serviceName}] Missing required environment variable(s): ${missing.join(", ")}`);
    process.exit(1);
  }
};

module.exports = { validateEnv };
