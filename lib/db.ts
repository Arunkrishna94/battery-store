import mysql from "mysql2/promise";

// Load environment variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = mysql.createPool({
  host: DB_HOST || "localhost",
  user: DB_USER || "root",
  password: DB_PASSWORD || "root",
  database: DB_NAME || "user_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

export const connectToDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};
