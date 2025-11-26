// lib/db.js
// Conexión a MySQL usando mysql2/promise (compatible con async/await)

import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

console.log("Conexión exitosa a la base de datos (mysql2/promise)");

export default db;