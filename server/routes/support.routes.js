const express = require("express");
const router = express.Router();
const supportController = require("../controllers/support.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.post("/", supportController.create);
router.get("/", supportController.list);
router.put("/:id/resolve", supportController.resolve);

module.exports = router;
