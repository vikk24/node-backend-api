const db = require('../config/db');

exports.getUsersWithPagination = (page, limit) => {
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id, name, email, created_at FROM users LIMIT ? OFFSET ?',
            [parseInt(limit), parseInt(offset)],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, name, email FROM users";

        db.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id, name, email FROM users WHERE email = ?',
            [email],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};