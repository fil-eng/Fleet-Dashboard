const db = require("../config/db");

async function create(data) {
  const [result] = await db.query(
    `INSERT INTO maintenance_records 
     (vehicle_id, description, cost, maintenance_date)
     VALUES (?, ?, ?, ?)`,
    [
      data.vehicle_id,
      data.description,
      data.cost || 0,
      data.maintenance_date,
    ]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await db.query(
    `SELECT mr.*, v.plate_number
     FROM maintenance_records mr
     JOIN vehicles v ON v.id = mr.vehicle_id
     ORDER BY mr.maintenance_date DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT * FROM maintenance_records WHERE id=? LIMIT 1",
    [id]
  );
  return rows[0];
}

module.exports = {
  create,
  findAll,
  findById,
};
