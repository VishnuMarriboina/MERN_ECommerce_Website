const app = require("./app");
const { port } = require("./config/env.config");

app.listen(port, () => {
  console.log(`[gateway] Running on http://localhost:${port}`);
});
