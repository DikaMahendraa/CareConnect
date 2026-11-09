const express = require('express');
const router = express.Router();

const AlertController = require('../controllers/AlertController');
const CaregiverPortalController = require('../controllers/CaregiverPortalController');

const { requireRole } = require('../middleware/authMiddleware');

// Dashboard caregiver
router.get(
    '/dashboard',
    requireRole('caregiver'),
    CaregiverPortalController.dashboard
);

// Daftar lansia
router.get(
    '/residents',
    requireRole('caregiver'),
    CaregiverPortalController.residents
);

// Alert Center
router.get(
    '/alerts',
    requireRole('caregiver'),
    AlertController.index
);

// Detail alert
router.get(
    '/alerts/:id',
    requireRole('caregiver'),
    AlertController.detail
);

// Tindak lanjut alert
router.post(
    '/alerts/:id/follow-up',
    requireRole('caregiver'),
    AlertController.followUp
);

// Monitoring aktivitas
router.get(
    '/monitoring',
    requireRole('caregiver'),
    CaregiverPortalController.monitoring
);

module.exports = router;
