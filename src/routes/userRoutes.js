const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
// 🔐 protected route
router.post('/', verifyToken, userController.signup);
router.get('/', verifyToken, userController.getUsers);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;