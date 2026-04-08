const mysql = require("mysql2");

// create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT), // 🔥 ensure number
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  family: 4, // 🔥 force IPv4 (fixes timeout issues)
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔥 test connection once
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ DB connected");
    connection.release();
  }
});

// 🔥 use promise wrapper (better with async/await)
module.exports = pool.promise();