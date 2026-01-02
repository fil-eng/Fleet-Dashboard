const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.post("/", driverController.create);
router.get("/", driverController.list);
router.post("/assign", driverController.assign);
router.post("/:id/unassign", driverController.unassign);

module.exports = router;
