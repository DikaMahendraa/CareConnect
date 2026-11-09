const CaregiverPortalModel = require('../models/CaregiverPortalModel');

// Dashboard caregiver
async function dashboard(req, res) {
    try {
        const caregiverId = req.session.user.id;

        const dashboardData =
            await CaregiverPortalModel.getDashboardData(caregiverId);

        res.render('caregiver/dashboard', {
            caregiverName: req.session.user.nama,
            ...dashboardData
        });

    } catch (error) {
        console.error('[CAREGIVER DASHBOARD ERROR]', error);
        res.status(500).send(
            'Terjadi kesalahan saat memuat dashboard caregiver.'
        );
    }
}

// Daftar lansia caregiver
async function residents(req, res) {
    try {
        const caregiverId = req.session.user.id;

        const residents =
            await CaregiverPortalModel.getResidentsByCaregiver(caregiverId);

        res.render('caregiver/residents', {
            caregiverName: req.session.user.nama,
            residents
        });

    } catch (error) {
        console.error('[CAREGIVER RESIDENTS ERROR]', error);
        res.status(500).send(
            'Terjadi kesalahan saat memuat daftar lansia.'
        );
    }
}

// Monitoring aktivitas caregiver
async function monitoring(req, res) {
    try {
        const caregiverId = req.session.user.id;

        const monitoringData =
            await CaregiverPortalModel.getMonitoringData(caregiverId);

        res.render('caregiver/monitoring', {
            caregiverName: req.session.user.nama,
            ...monitoringData
        });

    } catch (error) {
        console.error('[CAREGIVER MONITORING ERROR]', error);
        res.status(500).send(
            'Terjadi kesalahan saat memuat monitoring aktivitas.'
        );
    }
}

module.exports = {
    dashboard,
    residents,
    monitoring
};
