const { Server } = require("socket.io");
const supportService = require("../services/support.service");

let io;

function initSockets(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  // 🔗 Inject socket into services
  supportService.setSocket(io);

  io.on("connection", (socket) => {
    console.log("Admin connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Admin disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

module.exports = initSockets;
module.exports.getIO = getIO;
