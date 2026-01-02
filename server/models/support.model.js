const db = require("../config/db");

async function create(userId, message) {
  const [result] = await db.query(
    `INSERT INTO support_requests (user_id, message)
     VALUES (?, ?)`,
    [userId, message]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await db.query(
    `SELECT sr.*, u.name AS sender
     FROM support_requests sr
     JOIN users u ON u.id = sr.user_id
     ORDER BY sr.created_at DESC`
  );
  return rows;
}

async function resolve(id) {
  await db.query(
    `UPDATE support_requests SET status='RESOLVED' WHERE id=?`,
    [id]
  );
}

module.exports = {
  create,
  findAll,
  resolve,
};
