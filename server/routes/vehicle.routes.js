const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

router.use(authenticate);

router.post("/", vehicleController.create);
router.get("/", vehicleController.list);
router.get("/:id", vehicleController.get);
router.put("/:id", vehicleController.update);
router.delete(
  "/:id",
  authorize("SUPER_ADMIN"),
  vehicleController.remove
);

module.exports = router;
