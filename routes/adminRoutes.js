const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const { requireRole } = require('../middleware/authMiddleware');

// Dashboard Admin
router.get(
    '/dashboard',
    requireRole('admin'),
    AdminController.dashboard
);

module.exports = router;
