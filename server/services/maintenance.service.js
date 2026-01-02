const maintenanceModel = require("../models/maintenance.model");
const vehicleModel = require("../models/vehicle.model");

let io; // 🔹 added

function setSocket(socketIO) {
  io = socketIO;
}

async function logMaintenance(data) {
  if (!data.vehicle_id || !data.description || !data.maintenance_date) {
    throw new Error("Missing required maintenance data");
  }

  const vehicle = await vehicleModel.findById(data.vehicle_id);
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  await maintenanceModel.create(data);

  await vehicleModel.update(vehicle.id, {
    plate_number: vehicle.plate_number,
    model: vehicle.model,
    status: "IN_MAINTENANCE",
  });

  if (io) {
    io.emit("maintenance:logged", {
      vehicle_id: vehicle.id,
    });
  }
}

async function listMaintenance() {
  return await maintenanceModel.findAll();
}

async function completeMaintenance(vehicleId) {
  const vehicle = await vehicleModel.findById(vehicleId);
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  await vehicleModel.update(vehicle.id, {
    plate_number: vehicle.plate_number,
    model: vehicle.model,
    status: "ACTIVE",
  });

  if (io) {
    io.emit("maintenance:completed", {
      vehicle_id: vehicle.id,
    });
  }
}

module.exports = {
  logMaintenance,
  listMaintenance,
  completeMaintenance,
  setSocket, // 🔹 added
};
