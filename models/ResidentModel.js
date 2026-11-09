const db = require('../config/database');

// Mengambil semua data lansia
async function getAll() {
    const [rows] = await db.execute(`
        SELECT
            id,
            nama AS fullName,
            tanggal_lahir AS birthDate,
            TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) AS age,
            CASE
                WHEN jenis_kelamin = 'Laki-laki' THEN 'L'
                WHEN jenis_kelamin = 'Perempuan' THEN 'P'
                ELSE jenis_kelamin
            END AS gender,
            alamat AS address,
            phone,
            family_contact_name AS familyContactName,
            family_contact_phone AS familyContactPhone,
            status,
            created_at AS createdAt
        FROM residents
        ORDER BY created_at DESC
    `);

    return rows;
}

// Mengambil satu data lansia berdasarkan ID
async function findById(id) {
    const [rows] = await db.execute(`
        SELECT
            id,
            nama AS fullName,
            tanggal_lahir AS birthDate,
            TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) AS age,
            CASE
                WHEN jenis_kelamin = 'Laki-laki' THEN 'L'
                WHEN jenis_kelamin = 'Perempuan' THEN 'P'
                ELSE jenis_kelamin
            END AS gender,
            alamat AS address,
            phone,
            family_contact_name AS familyContactName,
            family_contact_phone AS familyContactPhone,
            status,
            created_at AS createdAt
        FROM residents
        WHERE id = ?
        LIMIT 1
    `, [id]);

    return rows[0];
}

// Menambahkan data lansia

async function create(data) {
    const {
        fullName,
        birthDate,
        gender,
        address,
        phone,
        familyContactName,
        familyContactPhone
    } = data;

    const jenisKelamin = gender === 'L'
        ? 'Laki-laki'
        : gender === 'P'
            ? 'Perempuan'
            : null;

    const [result] = await db.execute(`
        INSERT INTO residents (
            nama,
            tanggal_lahir,
            jenis_kelamin,
            alamat,
            phone,
            family_contact_name,
            family_contact_phone
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
        fullName,
        birthDate,
        jenisKelamin,
        address,
        phone || null,
        familyContactName || null,
        familyContactPhone || null
    ]);

    return result.insertId;
}

// Memperbarui data lansia

async function update(id, data) {
    const {
        fullName,
        birthDate,
        gender,
        address,
        phone,
        familyContactName,
        familyContactPhone
    } = data;

    const jenisKelamin = gender === 'L'
        ? 'Laki-laki'
        : gender === 'P'
            ? 'Perempuan'
            : null;

    const [result] = await db.execute(`
        UPDATE residents
        SET
            nama = ?,
            tanggal_lahir = ?,
            jenis_kelamin = ?,
            alamat = ?,
            phone = ?,
            family_contact_name = ?,
            family_contact_phone = ?
        WHERE id = ?
    `, [
        fullName,
        birthDate,
        jenisKelamin,
        address,
        phone || null,
        familyContactName || null,
        familyContactPhone || null,
        id
    ]);

    return result.affectedRows;
}


// Menghapus data lansia
async function remove(id) {
    const [result] = await db.execute(
        'DELETE FROM residents WHERE id = ?',
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    getAll,
    findById,
    create,
    update,
    remove
};
