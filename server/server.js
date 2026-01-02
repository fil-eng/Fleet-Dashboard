const http = require("http");
const app = require("./app");
require("dotenv").config();   // 👈 MUST be first line

const { port } = require("./config/env");
const initSockets = require("./sockets");
const db = require("./config/db");

const server = http.createServer(app);
// 🔌 Initialize sockets

initSockets(server);

server.listen(port, async () => {
  try {
    await db.query("SELECT 1");
    console.log(`Server running on port ${port} - DB connected`);
  } catch (err) {
    console.error(
      `Server running on port ${port} - DB connection failed:`,
      err.message
    );
  }
});
