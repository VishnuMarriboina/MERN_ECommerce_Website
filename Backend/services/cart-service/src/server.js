const { app, connectDB } = require("./app");
const { port } = require("./config/env.config");

const start = async () => {
  await connectDB();
  app.listen(port, () => console.log(`[cart-service] Running on http://localhost:${port}`));
};

start();
