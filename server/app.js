const express = require("express");
const cors = require("cors");
require("dotenv").config();   // 👈 MUST be first line

const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const vehicleRoutes = require("./routes/vehicle.routes");
const driverRoutes = require("./routes/driver.routes");
const maintenanceRoutes = require("./routes/maintenance.routes");
const supportRoutes = require("./routes/support.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/support", supportRoutes);

app.use(errorMiddleware);

module.exports = app;
