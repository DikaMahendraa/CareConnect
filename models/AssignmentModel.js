
const db = require('../config/database');

// Mengambil seluruh penugasan
async function getAll() {
    const [rows] = await db.execute(`
        SELECT
            ca.id,
            ca.resident_id AS residentId,
            ca.caregiver_id AS caregiverId,
            ca.assigned_at AS assignedAt,
            r.nama AS residentName,
            u.nama AS caregiverName
        FROM care_assignments ca
        JOIN residents r ON ca.resident_id = r.id
        JOIN users u ON ca.caregiver_id = u.id
        ORDER BY ca.assigned_at DESC
    `);

    return rows;
}

// Mengambil lansia yang belum memiliki caregiver
async function getUnassignedResidents() {
    const [rows] = await db.execute(`
        SELECT
            r.id,
            r.nama AS fullName,
            TIMESTAMPDIFF(YEAR, r.tanggal_lahir, CURDATE()) AS age
        FROM residents r
        WHERE NOT EXISTS (
            SELECT 1
            FROM care_assignments ca
            WHERE ca.resident_id = r.id
        )
        ORDER BY r.nama ASC
    `);

    return rows;
}

// Membuat penugasan baru
async function create(residentId, caregiverId) {
    const [result] = await db.execute(`
        INSERT INTO care_assignments
        (resident_id, caregiver_id)
        VALUES (?, ?)
    `, [residentId, caregiverId]);

    return result.insertId;
}

// Mengubah caregiver pada penugasan
async function update(id, caregiverId) {
    const [result] = await db.execute(`
        UPDATE care_assignments
        SET caregiver_id = ?
        WHERE id = ?
    `, [caregiverId, id]);

    return result.affectedRows;
}

// Menghapus penugasan
async function deleteById(id) {
    const [result] = await db.execute(`
        DELETE FROM care_assignments
        WHERE id = ?
    `, [id]);

    return result.affectedRows;
}

module.exports = {
    getAll,
    getUnassignedResidents,
    create,
    update,
    deleteById
};
