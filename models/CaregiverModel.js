const db = require('../config/database');

// Mengambil semua caregiver
async function getAll() {
    const [rows] = await db.execute(`
        SELECT
            u.id,
            u.nama AS fullName,
            u.email,
            u.phone,
            u.address,
            u.status,
            (
                SELECT COUNT(*)
                FROM care_assignments ca
                WHERE ca.caregiver_id = u.id
            ) AS residentCount
        FROM users u
        WHERE u.role = 'caregiver'
        ORDER BY u.nama ASC
    `);

    return rows;
}

// Mengambil caregiver berdasarkan ID

async function getById(id) {
    const [rows] = await db.execute(`
        SELECT
            u.id,
            u.nama AS fullName,
            u.email,
            u.phone,
            u.address,
            u.status
        FROM users u
        WHERE u.id = ?
        AND u.role = 'caregiver'
        LIMIT 1
    `, [id]);

    if (rows.length === 0) {
        return null;
    }

    const caregiver = rows[0];

    const [residents] = await db.execute(`
        SELECT
            r.id,
            r.nama AS fullName,
            TIMESTAMPDIFF(YEAR, r.tanggal_lahir, CURDATE()) AS age
        FROM care_assignments ca
        JOIN residents r ON ca.resident_id = r.id
        WHERE ca.caregiver_id = ?
        ORDER BY r.nama ASC
    `, [id]);

    caregiver.residents = residents;

    return caregiver;
}


// Menambahkan caregiver
async function create(data) {
    const [result] = await db.execute(`
        INSERT INTO users
        (nama, email, password, role, phone, address, status)
        VALUES (?, ?, ?, 'caregiver', ?, ?, ?)
    `, [
        data.fullName,
        data.email,
        data.password,
        data.phone,
        data.address,
        data.status
    ]);

    return result.insertId;
}

// Mengubah data caregiver
async function update(id, data) {
    const [result] = await db.execute(`
        UPDATE users
        SET nama = ?,
            email = ?,
            phone = ?,
            address = ?,
            status = ?
        WHERE id = ?
        AND role = 'caregiver'
    `, [
        data.fullName,
        data.email,
        data.phone,
        data.address,
        data.status,
        id
    ]);

    return result.affectedRows;
}

// Menghapus caregiver
async function deleteById(id) {
    const [result] = await db.execute(`
        DELETE FROM users
        WHERE id = ?
        AND role = 'caregiver'
    `, [id]);

    return result.affectedRows;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};
