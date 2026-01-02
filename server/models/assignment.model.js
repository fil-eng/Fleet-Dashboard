require("dotenv").config();   // 👈 ADD THIS AS FIRST LINE
const db = require("../config/db");

async function getActiveByDriver(driverId) {
  const [rows] = await db.query(
    `SELECT * FROM vehicle_assignments
     WHERE driver_id = ? AND unassigned_at IS NULL
     LIMIT 1`,
    [driverId]
  );
  return rows[0];
}

async function getActiveByVehicle(vehicleId) {
  const [rows] = await db.query(
    `SELECT * FROM vehicle_assignments
     WHERE vehicle_id = ? AND unassigned_at IS NULL
     LIMIT 1`,
    [vehicleId]
  );
  return rows[0];
}

async function assign(vehicleId, driverId) {
  const [result] = await db.query(
    `INSERT INTO vehicle_assignments (vehicle_id, driver_id)
     VALUES (?, ?)`,
    [vehicleId, driverId]
  );
  return result.insertId;
}

async function unassign(id) {
  await db.query(
    `UPDATE vehicle_assignments
     SET unassigned_at = NOW()
     WHERE id = ?`,
    [id]
  );
}

module.exports = {
  getActiveByDriver,
  getActiveByVehicle,
  assign,
  unassign,
};
