const driverService = require("../services/driver.service");

async function create(req, res, next) {
  try {
    const id = await driverService.createDriver(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const drivers = await driverService.listDrivers();
    res.json(drivers);
  } catch (err) {
    next(err);
  }
}

async function assign(req, res, next) {
  try {
    const { driverId, vehicleId } = req.body;
    await driverService.assignDriver(driverId, vehicleId);
    res.json({ message: "Driver assigned" });
  } catch (err) {
    next(err);
  }
}

async function unassign(req, res, next) {
  try {
    await driverService.unassignDriver(req.params.id);
    res.json({ message: "Driver unassigned" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  list,
  assign,
  unassign,
};
