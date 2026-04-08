const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');

// GET users
exports.getUsers = async (req, res) => {
    const email = req.query.email;

    try {
        let users;

        // 🔍 filtering logic
        if (email) {
            users = await userService.getUserByEmail(email);
        } else {
            // 🔥 FIX: get ALL users (no pagination)
            users = await userService.getAllUsers();
        }

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
// SIGNUP
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        // 🔍 check if email already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            // 🔐 hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

            db.query(sql, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "User registered successfully"
                });
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "DB error" });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // create token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token
        });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

    db.query(sql, [name, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false });
        }

        res.json({
            success: true,
            message: "User updated"
        });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false });
        }

        res.json({
            success: true,
            message: "User deleted"
        });
    });
};