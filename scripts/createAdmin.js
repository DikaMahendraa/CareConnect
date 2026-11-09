
const db = require('../config/database');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        const nama = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        // Validasi data admin
        if (!nama || !email || !password) {
            throw new Error('Data admin belum lengkap di file .env');
        }

        // Cek apakah email sudah digunakan
        const [existingUser] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            console.log('[ADMIN] Email tersebut sudah terdaftar.');
            return;
        }

        // Hash password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan akun admin ke database
        await db.execute(
            `INSERT INTO users (nama, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [nama, email, hashedPassword, 'admin']
        );

        console.log('[ADMIN] Akun Admin berhasil dibuat!');
        console.log(`[ADMIN] Email: ${email}`);

    } catch (error) {
        console.error('[ADMIN ERROR]', error.message);

    } finally {
        await db.end();
    }
}

createAdmin();
