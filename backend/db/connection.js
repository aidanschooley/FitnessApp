import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// OPTIONAL connection test
(async () => {
    try {
        const conn = await db.getConnection();
        console.log("MySQL connected!");
        conn.release();
    } catch (err) {
        console.error("MySQL connection error:", err);
    }
})();

export default db;



