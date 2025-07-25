import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "operturn_explorer",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log("Database connection established successfully");

    // Check if our tables exist
    const [tables] = await connection.execute("SHOW TABLES LIKE 'blocks'");
    if ((tables as any[]).length === 0) {
      console.log("Database tables not found. Please run the create-tables.sql script first.");
      console.log("Command: mysql -h [host] -u [user] -p < create-tables.sql");
    } else {
      console.log("Database tables are ready");
    }

    connection.release();
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}
