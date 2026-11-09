const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

// Menampilkan halaman login
router.get('/login', AuthController.showLogin);

// Memproses login
router.post('/login', AuthController.login);

// Logout
router.get('/logout', AuthController.logout);

module.exports = router;
