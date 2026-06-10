const { app, connectDB } = require("./app");
const { port } = require("./config/env.config");

const start = async () => {
  await connectDB();
  app.listen(port, () => console.log(`[order-service] Running on http://localhost:${port}`));
};

start();
