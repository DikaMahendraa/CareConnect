const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const CaregiverController = require('../controllers/CaregiverController');
const AssignmentController = require('../controllers/AssignmentController');
const SimulationController = require('../controllers/SimulationController');

const { requireRole } = require('../middleware/authMiddleware');

// Dashboard Admin
router.get(
    '/dashboard',
    requireRole('admin'),
    AdminController.dashboard
);

// Daftar caregiver
router.get(
    '/caregivers',
    requireRole('admin'),
    CaregiverController.index
);

// Form tambah caregiver
router.get(
    '/caregivers/new',
    requireRole('admin'),
    CaregiverController.createForm
);

// Simpan caregiver baru
router.post(
    '/caregivers',
    requireRole('admin'),
    CaregiverController.store
);

// Detail caregiver
router.get(
    '/caregivers/:id',
    requireRole('admin'),
    CaregiverController.detail
);

// Form edit caregiver
router.get(
    '/caregivers/:id/edit',
    requireRole('admin'),
    CaregiverController.editForm
);

// Update caregiver
router.post(
    '/caregivers/:id/update',
    requireRole('admin'),
    CaregiverController.update
);

// Hapus caregiver
router.post(
    '/caregivers/:id/delete',
    requireRole('admin'),
    CaregiverController.destroy
);


// ======================================
// PENUGASAN CAREGIVER
// ======================================

// Menampilkan halaman penugasan
router.get(
    '/assignments',
    requireRole('admin'),
    AssignmentController.index
);

// Membuat penugasan baru
router.post(
    '/assignments',
    requireRole('admin'),
    AssignmentController.store
);

// Mengubah caregiver pada penugasan
router.post(
    '/assignments/:id/update',
    requireRole('admin'),
    AssignmentController.update
);

// Menghapus penugasan
router.post(
    '/assignments/:id/delete',
    requireRole('admin'),
    AssignmentController.destroy
);

// ======================================
// SIMULATION
// ======================================

// Menampilkan halaman Simulation
router.get(
    '/simulation',
    requireRole('admin'),
    SimulationController.index
);

// Memproses simulasi aktivitas lansia
router.post(
    '/simulation',
    requireRole('admin'),
    SimulationController.store
);


module.exports = router;
