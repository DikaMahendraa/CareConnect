const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const db = require('./config/database');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const residentRoutes = require('./routes/residentRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: 'lax'
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/residents', residentRoutes);
app.use('/caregiver', caregiverRoutes);

// Halaman utama
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Konfigurasi Server
const PORT = process.env.PORT || 3000;

// Menjalankan server
async function startServer() {
    try {
        const connection = await db.getConnection();

        console.log('[DATABASE] Berhasil terhubung ke MySQL!');

        connection.release();

        app.listen(PORT, () => {
            console.log(`[SERVER] CareConnect berjalan di http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('[DATABASE] Koneksi gagal:', error.message);
    }
}

startServer();
