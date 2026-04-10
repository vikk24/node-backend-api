const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');

// GET users
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("GET USERS ERROR:", error); // 👈 ADD THIS
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("🔥 SIGNUP HIT:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    // ✅ check existing user
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error); // 🔥 VERY IMPORTANT

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// LOGIN
exports.login = async (req, res) => {

    
  console.log("🔥 LOGIN HIT");
  console.log("📦 BODY:", req.body);
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h",
    }
    );

    return res.json({
    success: true,
    message: "Login successful",
    token,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully"
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};