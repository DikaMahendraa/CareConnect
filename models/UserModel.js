const db = require('../config/database');

// Mengambil data user berdasarkan email
async function findByEmail(email) {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
    );

    return rows[0];
}

// Mengambil data user berdasarkan ID
async function findById(id) {
    const [rows] = await db.execute(
        'SELECT id, nama, email, role FROM users WHERE id = ? LIMIT 1',
        [id]
    );

    return rows[0];
}

module.exports = {
    findByEmail,
    findById
};
