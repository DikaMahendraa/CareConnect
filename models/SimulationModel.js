const db = require('../config/database');

// Mengambil daftar lansia untuk pilihan simulasi
async function getResidents() {
    const [rows] = await db.execute(`
        SELECT
            id,
            nama,
            status
        FROM residents
        ORDER BY nama ASC
    `);

    return rows;
}

// Membuat simulasi aktivitas dan alert
async function createSimulation(data) {
    const connection = await db.getConnection();

    const alertTypes = {
        'Possible Fall': {
            severity: 'Critical',
            alertType: 'Possible Fall',
            message: 'Simulasi mendeteksi kemungkinan lansia terjatuh.'
        },
        'No Movement': {
            severity: 'High',
            alertType: 'No Movement',
            message: 'Simulasi mendeteksi tidak ada pergerakan lansia.'
        },
        'Sensor Offline': {
            severity: 'Medium',
            alertType: 'Sensor Offline',
            message: 'Simulasi mendeteksi sensor tidak aktif.'
        }
    };

    const allowedEvents = [
        'Normal Activity',
        'Outside',
        'Returned',
        'No Movement',
        'Possible Fall',
        'Sensor Offline'
    ];

    if (!allowedEvents.includes(data.eventType)) {
        throw new Error('Jenis aktivitas tidak valid.');
    }

    try {
        await connection.beginTransaction();

        // Simpan aktivitas
        const [eventResult] = await connection.execute(
            `INSERT INTO activity_events
                (resident_id, event_type, description, occurred_at, source)
             VALUES (?, ?, ?, NOW(), 'simulation')`,
            [
                data.residentId,
                data.eventType,
                data.description
            ]
        );

        // Perbarui status lansia
        let residentStatus = null;

        if (data.eventType === 'Outside') {
            residentStatus = 'Outside';
        } else if (
            data.eventType === 'Returned' ||
            data.eventType === 'Normal Activity'
        ) {
            residentStatus = 'At Home';
        } else if (data.eventType === 'No Movement') {
            residentStatus = 'No Movement';
        }

        if (residentStatus) {
            await connection.execute(
                'UPDATE residents SET status = ? WHERE id = ?',
                [residentStatus, data.residentId]
            );
        }

        // Buat alert untuk kejadian tertentu
        const alertConfig = alertTypes[data.eventType];

        if (alertConfig) {
            await connection.execute(
                `INSERT INTO alerts
                    (resident_id, event_id, alert_type, severity, status, message)
                 VALUES (?, ?, ?, ?, 'Pending', ?)`,
                [
                    data.residentId,
                    eventResult.insertId,
                    alertConfig.alertType,
                    alertConfig.severity,
                    alertConfig.message
                ]
            );
        }

        await connection.commit();

        return {
            eventId: eventResult.insertId,
            alertCreated: Boolean(alertConfig)
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getResidents,
    createSimulation
};