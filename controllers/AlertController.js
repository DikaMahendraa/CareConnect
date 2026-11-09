const AlertModel = require('../models/AlertModel');

// Menampilkan daftar alert.
async function index(req, res) {
    try {
        const caregiverId = req.session.user.id;
        const status = req.query.status || '';

        const alerts = await AlertModel.getAllByCaregiver(
            caregiverId,
            status
        );

        const unhandledCount = alerts.filter(
            alert => alert.status !== 'Resolved'
        ).length;

        const highPriorityCount = alerts.filter(
            alert => ['High', 'Critical'].includes(alert.priority)
        ).length;

        res.render('caregiver/alerts', {
            alerts,
            filters: { status },
            unhandledCount,
            totalAlerts: alerts.length,
            highPriorityCount
        });

    } catch (error) {
        console.error('[ALERT] Gagal mengambil data:', error);
        res.status(500).send('Gagal memuat Alert Center.');
    }
}

// Menampilkan detail alert.
async function detail(req, res) {
    try {
        const caregiverId = req.session.user.id;

        const alert = await AlertModel.getById(
            req.params.id,
            caregiverId
        );

        if (!alert) {
            return res.status(404).send('Alert tidak ditemukan.');
        }

        res.render('caregiver/alert-detail', {
            alert,
            error: null,
            success: null
        });

    } catch (error) {
        console.error('[ALERT] Gagal mengambil detail:', error);
        res.status(500).send('Gagal memuat detail alert.');
    }
}

// Menangani tindak lanjut alert.
async function followUp(req, res) {
    try {
        const caregiverId = req.session.user.id;
        const alertId = req.params.id;
        const action = req.body.action;
        const note = (req.body.note || '').trim();

        if (!['acknowledge', 'resolve'].includes(action)) {
            return res.status(400).send('Tindakan tidak valid.');
        }

        if (note.length > 2000) {
            return res.status(400).send('Catatan maksimal 2.000 karakter.');
        }

        const alert = await AlertModel.getById(alertId, caregiverId);

        if (!alert) {
            return res.status(404).send('Alert tidak ditemukan.');
        }

        if (alert.status === 'Resolved') {
            return res.status(400).send('Alert sudah diselesaikan.');
        }

        const actionType = action === 'acknowledge'
            ? 'Acknowledged'
            : 'Resolved';

        await AlertModel.addAction(
            alertId,
            caregiverId,
            actionType,
            note
        );

        return res.redirect(`/caregiver/alerts/${alertId}`);

    } catch (error) {
        console.error('[ALERT] Gagal menyimpan tindak lanjut:', error);
        res.status(500).send('Gagal menyimpan tindak lanjut alert.');
    }
}

module.exports = {
    index,
    detail,
    followUp
};
