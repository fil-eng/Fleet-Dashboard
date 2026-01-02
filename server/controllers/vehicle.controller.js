const vehicleService = require("../services/vehicle.service");

async function create(req, res, next) {
  try {
    const id = await vehicleService.createVehicle(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const vehicles = await vehicleService.getVehicles();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (err) {
    err.status = 404;
    next(err);
  }
}

async function update(req, res, next) {
  try {
    await vehicleService.updateVehicle(req.params.id, req.body);
    res.json({ message: "Vehicle updated" });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  list,
  get,
  update,
  remove,
};
