
require("dotenv").config();   // 👈 ADD THIS AS FIRST LINE

const bcrypt = require("bcrypt");
const db = require("../config/db");

async function seedUsers() {
  try {
    const users = [
      {
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "password123",
        role: "SUPER_ADMIN",
      },
      {
        name: "Admin User",
        email: "admin@gmail.com",
        password: "password123",
        role: "ADMIN",
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert only if the email does not exist
      await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE email=email`,
        [user.name, user.email, hashedPassword, user.role]
      );

      console.log(`Seeded: ${user.email} (${user.role})`);
    }

    console.log("All users seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedUsers();
