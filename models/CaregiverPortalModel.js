const db = require('../config/database');

// Mengambil statistik dan aktivitas dashboard caregiver
async function getDashboardData(caregiverId) {

    // 1. Mengambil statistik lansia
    const [residentStats] = await db.execute(`
        SELECT
            COUNT(r.id) AS totalResidents,
            SUM(CASE WHEN r.status = 'At Home' THEN 1 ELSE 0 END) AS atHomeCount,
            SUM(CASE WHEN r.status = 'Outside' THEN 1 ELSE 0 END) AS outsideCount
        FROM care_assignments ca
        JOIN residents r ON r.id = ca.resident_id
        WHERE ca.caregiver_id = ?
    `, [caregiverId]);

    // 2. Menghitung alert yang belum diselesaikan
    const [alertStats] = await db.execute(`
        SELECT COUNT(DISTINCT a.id) AS activeAlerts
        FROM alerts a
        JOIN care_assignments ca ON ca.resident_id = a.resident_id
        WHERE ca.caregiver_id = ?
        AND a.status = 'Pending'
    `, [caregiverId]);

    // 3. Mengambil lima aktivitas terbaru
    const [recentActivities] = await db.execute(`
        SELECT
            ae.id,
            r.nama AS resident_name,
            ae.event_type,
            ae.description,
            ae.occurred_at
        FROM activity_events ae
        JOIN residents r ON r.id = ae.resident_id
        JOIN care_assignments ca ON ca.resident_id = r.id
        WHERE ca.caregiver_id = ?
        ORDER BY ae.occurred_at DESC
        LIMIT 5
    `, [caregiverId]);

    return {
        totalResidents: residentStats[0].totalResidents || 0,
        atHomeCount: residentStats[0].atHomeCount || 0,
        outsideCount: residentStats[0].outsideCount || 0,
        activeAlerts: alertStats[0].activeAlerts || 0,
        recentActivities
    };
}


// Mengambil daftar lansia berdasarkan caregiver yang login
async function getResidentsByCaregiver(caregiverId) {
    const [rows] = await db.execute(`
        SELECT
            r.id,
            r.nama,
            TIMESTAMPDIFF(YEAR, r.tanggal_lahir, CURDATE()) AS usia,
            r.status AS status_aktivitas,
            NULL AS foto
        FROM care_assignments ca
        JOIN residents r ON r.id = ca.resident_id
        WHERE ca.caregiver_id = ?
        ORDER BY r.nama ASC
    `, [caregiverId]);

    return rows;
}


async function getMonitoringData(caregiverId) {

    // 1. Mengambil ringkasan status lansia
    const [statusRows] = await db.execute(`
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN r.status = 'At Home' THEN 1 ELSE 0 END) AS atHome,
            SUM(CASE WHEN r.status = 'Outside' THEN 1 ELSE 0 END) AS outside,
            SUM(CASE WHEN r.status = 'No Movement' THEN 1 ELSE 0 END) AS noMovement
        FROM care_assignments ca
        JOIN residents r ON r.id = ca.resident_id
        WHERE ca.caregiver_id = ?
    `, [caregiverId]);

    // 2. Mengambil aktivitas terbaru
    const [latestRows] = await db.execute(`
        SELECT
            ae.event_type,
            ae.occurred_at
        FROM activity_events ae
        JOIN care_assignments ca ON ca.resident_id = ae.resident_id
        WHERE ca.caregiver_id = ?
        ORDER BY ae.occurred_at DESC
        LIMIT 1
    `, [caregiverId]);

    // 3. Mengambil riwayat aktivitas
    const [activities] = await db.execute(`
        SELECT
            r.nama AS nama_lansia,
            ae.event_type AS jenis_aktivitas,
            r.status AS status,
            ae.occurred_at AS waktu,
            NULL AS durasi_di_luar
        FROM activity_events ae
        JOIN residents r ON r.id = ae.resident_id
        JOIN care_assignments ca ON ca.resident_id = r.id
        WHERE ca.caregiver_id = ?
        ORDER BY ae.occurred_at DESC
        LIMIT 50
    `, [caregiverId]);

    const stats = statusRows[0];

    return {
        monitoringStats: {
            atHome: stats.atHome || 0,
            outside: stats.outside || 0,
            noMovement: stats.noMovement || 0,
            lastActivity: latestRows.length > 0
                ? latestRows[0].event_type
                : 'Belum tersedia',
            outsideDuration: 'Belum tersedia'
        },
        activities
    };
}

module.exports = {
    getDashboardData,
    getResidentsByCaregiver,
    getMonitoringData
};