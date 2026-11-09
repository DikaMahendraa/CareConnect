const express = require('express');
const router = express.Router();

const ResidentController = require('../controllers/ResidentController');
const { requireRole } = require('../middleware/authMiddleware');

// Menampilkan daftar lansia
router.get('/', requireRole('admin'), ResidentController.index);

// Menampilkan form tambah lansia
router.get('/new', requireRole('admin'), ResidentController.createForm);

// Menyimpan data lansia
router.post('/', requireRole('admin'), ResidentController.store);

// Menampilkan detail lansia
router.get('/:id', requireRole('admin'), ResidentController.detail);

// Menampilkan form edit lansia
router.get('/:id/edit', requireRole('admin'), ResidentController.editForm);

// Memperbarui data lansia
router.post('/:id/update', requireRole('admin'), ResidentController.update);

// Menghapus data lansia
router.post('/:id/delete', requireRole('admin'), ResidentController.destroy);

module.exports = router;
