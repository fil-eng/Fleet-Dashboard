const db = require("../config/db");

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    console.log("DB connected:", rows);
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err.message || err);
    process.exit(1);
  }
})();
