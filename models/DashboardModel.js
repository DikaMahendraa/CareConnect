const db = require('../config/database');

// Mengambil statistik utama dashboard
async function getStats() {
    const [rows] = await db.execute(`
        SELECT
            (SELECT COUNT(*) FROM residents) AS totalResidents,

            (SELECT COUNT(*)
             FROM users
             WHERE role = 'caregiver') AS totalCaregivers,

            (SELECT COUNT(DISTINCT resident_id)
             FROM care_assignments) AS assignedResidents,

            (
                (SELECT COUNT(*) FROM residents) -
                (SELECT COUNT(DISTINCT resident_id)
                 FROM care_assignments)
            ) AS unassignedResidents
    `);

    return rows[0];
}

// Mengambil aktivitas terbaru
async function getRecentActivities() {
    const [rows] = await db.execute(`
        SELECT
            ae.id,
            ae.event_type,
            ae.description,
            ae.occurred_at AS createdAt,
            r.nama AS residentName,

            COALESCE(
                (
                    SELECT u.nama
                    FROM care_assignments ca
                    JOIN users u ON ca.caregiver_id = u.id
                    WHERE ca.resident_id = ae.resident_id
                    ORDER BY ca.assigned_at DESC
                    LIMIT 1
                ),
                'Belum ditugaskan'
            ) AS caregiverName

        FROM activity_events ae
        JOIN residents r ON ae.resident_id = r.id
        ORDER BY ae.occurred_at DESC
        LIMIT 5
    `);

    return rows.map(activity => ({
        type: 'other',
        title: activity.description || activity.event_type,
        residentName: activity.residentName,
        caregiverName: activity.caregiverName,
        createdAt: activity.createdAt
    }));
}

// Mengambil alert terbaru
async function getRecentAlerts() {
    const [rows] = await db.execute(`
        SELECT
            a.id,
            a.alert_type,
            a.severity,
            a.message,
            a.status,
            a.created_at AS createdAt,
            r.nama AS residentName

        FROM alerts a
        JOIN residents r ON a.resident_id = r.id
        ORDER BY a.created_at DESC
        LIMIT 5
    `);

    return rows.map(alert => ({
        level: alert.severity.toLowerCase() === 'critical'
            ? 'high'
            : alert.severity.toLowerCase(),
        message: alert.message,
        residentName: alert.residentName,
        createdAt: alert.createdAt,
        status: alert.status
    }));
}

module.exports = {
    getStats,
    getRecentActivities,
    getRecentAlerts
};
