const db = require('../config/database');

// Mengambil daftar alert milik lansia yang ditugaskan
// kepada caregiver tertentu.
async function getAllByCaregiver(caregiverId, statusFilter = '') {
    const [rows] = await db.execute(`
        SELECT
            a.id,
            a.resident_id,
            r.nama AS resident_name,
            a.alert_type,
            a.message AS description,
            ae.occurred_at,
            a.severity AS priority,

            CASE
                WHEN a.status = 'Handled' THEN 'Resolved'
                WHEN EXISTS (
                    SELECT 1
                    FROM alert_actions aa
                    WHERE aa.alert_id = a.id
                    AND aa.action_type = 'Acknowledged'
                ) THEN 'Acknowledged'
                ELSE 'New'
            END AS status

        FROM alerts a
        JOIN residents r
            ON a.resident_id = r.id
        LEFT JOIN activity_events ae
            ON a.event_id = ae.id
        JOIN care_assignments ca
            ON ca.resident_id = a.resident_id

        WHERE ca.caregiver_id = ?

        ORDER BY a.created_at DESC
    `, [caregiverId]);

    if (!statusFilter) return rows;

    return rows.filter(alert => alert.status === statusFilter);
}

// Mengambil detail satu alert milik caregiver.
async function getById(id, caregiverId) {
    const [rows] = await db.execute(`
        SELECT
            a.id,
            a.resident_id,
            r.nama AS resident_name,
            a.alert_type,
            a.message AS description,
            ae.occurred_at,
            a.severity AS priority,

            CASE
                WHEN a.status = 'Handled' THEN 'Resolved'
                WHEN EXISTS (
                    SELECT 1
                    FROM alert_actions aa
                    WHERE aa.alert_id = a.id
                    AND aa.action_type = 'Acknowledged'
                ) THEN 'Acknowledged'
                ELSE 'New'
            END AS status,

            (
                SELECT u.nama
                FROM alert_actions aa
                JOIN users u ON aa.user_id = u.id
                WHERE aa.alert_id = a.id
                AND aa.action_type = 'Acknowledged'
                ORDER BY aa.created_at ASC
                LIMIT 1
            ) AS acknowledged_by_name,

            (
                SELECT aa.created_at
                FROM alert_actions aa
                WHERE aa.alert_id = a.id
                AND aa.action_type = 'Acknowledged'
                ORDER BY aa.created_at ASC
                LIMIT 1
            ) AS acknowledged_at,

            (
                SELECT u.nama
                FROM alert_actions aa
                JOIN users u ON aa.user_id = u.id
                WHERE aa.alert_id = a.id
                AND aa.action_type = 'Resolved'
                ORDER BY aa.created_at DESC
                LIMIT 1
            ) AS resolved_by_name,

            (
                SELECT aa.created_at
                FROM alert_actions aa
                WHERE aa.alert_id = a.id
                AND aa.action_type = 'Resolved'
                ORDER BY aa.created_at DESC
                LIMIT 1
            ) AS resolved_at,

            (
                SELECT aa.action_note
                FROM alert_actions aa
                WHERE aa.alert_id = a.id
                AND aa.action_note IS NOT NULL
                ORDER BY aa.created_at DESC
                LIMIT 1
            ) AS caregiver_note

        FROM alerts a
        JOIN residents r
            ON a.resident_id = r.id
        LEFT JOIN activity_events ae
            ON a.event_id = ae.id
        JOIN care_assignments ca
            ON ca.resident_id = a.resident_id

        WHERE a.id = ?
        AND ca.caregiver_id = ?

        LIMIT 1
    `, [id, caregiverId]);

    return rows[0] || null;
}

// Menyimpan tindakan caregiver.
async function addAction(alertId, userId, actionType, note) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute(`
            INSERT INTO alert_actions
                (alert_id, user_id, action_type, action_note)
            VALUES (?, ?, ?, ?)
        `, [alertId, userId, actionType, note || null]);

        if (actionType === 'Resolved') {
            await connection.execute(`
                UPDATE alerts
                SET status = 'Handled'
                WHERE id = ?
            `, [alertId]);
        }

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {
    getAllByCaregiver,
    getById,
    addAction
};
