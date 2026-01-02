const maintenanceService = require("../services/maintenance.service");

async function create(req, res, next) {
  try {
    await maintenanceService.logMaintenance(req.body);
    res.status(201).json({ message: "Maintenance logged" });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const records = await maintenanceService.listMaintenance();
    res.json(records);
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    await maintenanceService.completeMaintenance(req.params.vehicleId);
    res.json({ message: "Maintenance completed" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  list,
  complete,
};
