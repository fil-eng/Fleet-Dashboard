const supportModel = require("../models/support.model");

let io;

function setSocket(socketIO) {
  io = socketIO;
}

async function createRequest(userId, message) {
  if (!message || message.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  const id = await supportModel.create(userId, message);

  if (io) {
    io.emit("support:new", {
      id,
      message,
      created_at: new Date(),
    });
  }

  return id;
}

async function listRequests() {
  return await supportModel.findAll();
}

async function resolveRequest(id) {
  await supportModel.resolve(id);

  if (io) {
    io.emit("support:resolved", { id });
  }
}

module.exports = {
  setSocket,
  createRequest,
  listRequests,
  resolveRequest,
};
