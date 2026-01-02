const driverModel = require("../models/driver.model");
const vehicleModel = require("../models/vehicle.model");
const assignmentModel = require("../models/assignment.model");

let io; // 🔹 added

function setSocket(socketIO) {
  io = socketIO;
}

async function createDriver(data) {
  if (!data.full_name) throw new Error("Driver name required");

  const id = await driverModel.create(data);

  if (io) {
    io.emit("driver:created", { id });
  }

  return id;
}

async function listDrivers() {
  return await driverModel.findAll();
}

async function assignDriver(driverId, vehicleId) {
  const driver = await driverModel.findById(driverId);
  const vehicle = await vehicleModel.findById(vehicleId);

  if (!driver || !vehicle) {
    throw new Error("Driver or vehicle not found");
  }

  const driverActive = await assignmentModel.getActiveByDriver(driverId);
  const vehicleActive = await assignmentModel.getActiveByVehicle(vehicleId);

  if (driverActive || vehicleActive) {
    throw new Error("Driver or vehicle already assigned");
  }

  await assignmentModel.assign(vehicleId, driverId);

  await driverModel.update(driverId, {
    full_name: driver.full_name,
    phone: driver.phone,
    status: "ASSIGNED",
  });

  await vehicleModel.update(vehicleId, {
    plate_number: vehicle.plate_number,
    model: vehicle.model,
    status: "ACTIVE",
  });

  if (io) {
    io.emit("assignment:assigned", {
      driver_id: driverId,
      vehicle_id: vehicleId,
    });
  }
}

async function unassignDriver(driverId) {
  const active = await assignmentModel.getActiveByDriver(driverId);

  if (!active) {
    throw new Error("No active assignment found");
  }

  await assignmentModel.unassign(active.id);

  const driver = await driverModel.findById(driverId);
  const vehicle = await vehicleModel.findById(active.vehicle_id);

  await driverModel.update(driverId, {
    full_name: driver.full_name,
    phone: driver.phone,
    status: "AVAILABLE",
  });

  await vehicleModel.update(vehicle.id, {
    plate_number: vehicle.plate_number,
    model: vehicle.model,
    status: "ACTIVE",
  });

  if (io) {
    io.emit("assignment:unassigned", {
      driver_id: driverId,
      vehicle_id: vehicle.id,
    });
  }
}

module.exports = {
  createDriver,
  listDrivers,
  assignDriver,
  unassignDriver,
  setSocket, // 🔹 added
};
