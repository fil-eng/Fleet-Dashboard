const db = require("../config/db");

async function create(data) {
  const { plate_number, model, status } = data;
  const [result] = await db.query(
    `INSERT INTO vehicles (plate_number, model, status)
     VALUES (?, ?, ?)`,
    [plate_number, model, status]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await db.query(
    "SELECT * FROM vehicles ORDER BY created_at DESC"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT * FROM vehicles WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0];
}

async function update(id, data) {
  const { plate_number, model, status } = data;
  await db.query(
    `UPDATE vehicles
     SET plate_number = ?, model = ?, status = ?
     WHERE id = ?`,
    [plate_number, model, status, id]
  );
}

async function remove(id) {
  await db.query("DELETE FROM vehicles WHERE id = ?", [id]);
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};
