const vehicleModel = require("../models/vehicle.model");

let io; // 🔹 added (optional socket reference)

function setSocket(socketIO) {
  io = socketIO;
}

async function createVehicle(data) {
  if (!data.plate_number) {
    throw new Error("Plate number is required");
  }

  const id = await vehicleModel.create({
    plate_number: data.plate_number,
    model: data.model || null,
    status: data.status || "ACTIVE",
  });

  if (io) {
    io.emit("vehicle:created", { id });
  }

  return id;
}

async function getVehicles() {
  return await vehicleModel.findAll();
}

async function getVehicleById(id) {
  const vehicle = await vehicleModel.findById(id);
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
  return vehicle;
}

async function updateVehicle(id, data) {
  await getVehicleById(id);
  await vehicleModel.update(id, data);

  if (io) {
    io.emit("vehicle:updated", { id });
  }
}

async function deleteVehicle(id) {
  await getVehicleById(id);
  await vehicleModel.remove(id);

  if (io) {
    io.emit("vehicle:deleted", { id });
  }
}

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  setSocket, // 🔹 added export
};
