const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenance.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.post("/", maintenanceController.create);
router.get("/", maintenanceController.list);
router.post(
  "/complete/:vehicleId",
  maintenanceController.complete
);

module.exports = router;
