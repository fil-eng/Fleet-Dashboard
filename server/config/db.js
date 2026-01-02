const mysql = require("mysql2/promise");
const db = require("../config/db"); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
// console.log("MySQL Connection Pool configured.");
// console.log({
//   DB_HOST: process.env.DB_HOST,
//   DB_PORT: process.env.DB_PORT,
//   DB_USER: process.env.DB_USER,
//   DB_NAME: process.env.DB_NAME,
// });

module.exports = pool;

    