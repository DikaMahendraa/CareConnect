const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

// Menampilkan halaman login
function showLogin(req, res) {
    res.render('auth/login', {
        error: null
    });
}

// Memproses login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.render('auth/login', {
                error: 'Email dan password wajib diisi.'
            });
        }

        // Cari user berdasarkan email
        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.render('auth/login', {
                error: 'Email atau password salah.'
            });
        }

        // Periksa password dengan bcrypt
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.render('auth/login', {
                error: 'Email atau password salah.'
            });
        }

        // Simpan informasi user ke session
        req.session.user = {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role
        };

        // Arahkan berdasarkan role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }

        return res.redirect('/caregiver/dashboard');

    } catch (error) {
        console.error('[LOGIN ERROR]', error.message);

        return res.status(500).render('auth/login', {
            error: 'Terjadi kesalahan pada server.'
        });
    }
}

// Logout
function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error('[LOGOUT ERROR]', error.message);
            return res.status(500).send('Gagal melakukan logout.');
        }

        res.redirect('/login');
    });
}

module.exports = {
    showLogin,
    login,
    logout
}


