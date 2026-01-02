const db = require("../config/db");

async function create(data) {
  const [result] = await db.query(
    `INSERT INTO drivers (full_name, phone, status)
     VALUES (?, ?, ?)`,
    [data.full_name, data.phone, data.status || "AVAILABLE"]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await db.query(
    "SELECT * FROM drivers ORDER BY created_at DESC"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT * FROM drivers WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0];
}

async function update(id, data) {
  await db.query(
    `UPDATE drivers SET full_name=?, phone=?, status=? WHERE id=?`,
    [data.full_name, data.phone, data.status, id]
  );
}

module.exports = {
  create,
  findAll,
  findById,
  update,
};
