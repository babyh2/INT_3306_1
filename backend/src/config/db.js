import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import "./dotenv.js";

const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "quanlysanbong",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Sequelize instance for ORM
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'quanlysanbong',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  port: Number(process.env.DB_PORT || 3306),
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default db;
